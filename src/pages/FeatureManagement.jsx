import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiImage } from "react-icons/fi";
import { getAllData, addData, updateData, deleteData, uploadImageToCloudinary } from "../Helper/firebaseHelper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FeatureManagement() {
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
  });

  // Filter features based on search term
  useEffect(() => {
    let filtered = features;
    
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(feature =>
        feature.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredFeatures(filtered);
  }, [searchTerm, features]);

  // Load all features from Firestore
  const loadFeatures = async () => {
    try {
      setLoading(true);
      const featureData = await getAllData("features");
      setFeatures(featureData || []);
    } catch (error) {
      console.error("Error loading features:", error);
      toast.error("Error loading features. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const handleAddFeature = () => {
    setEditingFeature(null);
    setFormData({ title: "", image: "" });
    setImagePreview(null);
    setShowForm(true);
  };

  const handleEditFeature = (feature) => {
    setEditingFeature(feature.id);
    setFormData({
      title: feature.title || "",
      image: feature.image || "",
    });
    setImagePreview(feature.image || null);
    setShowForm(true);
  };

  const handleDeleteFeature = async (featureId) => {
    const feature = features.find(f => f.id === featureId);
    const featureTitle = feature?.title || 'this feature';
    
    if (window.confirm(`Are you sure you want to delete "${featureTitle}"?`)) {
      try {
        setLoading(true);
        await deleteData("features", featureId);
        toast.success("Feature deleted successfully!");
        loadFeatures();
      } catch (error) {
        console.error("Error deleting feature:", error);
        toast.error("Error deleting feature. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary using helper function
      const imageUrl = await uploadImageToCloudinary(file);
      
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);
      
      const featureData = {
        title: formData.title.trim(),
        image: formData.image,
        createdAt: editingFeature ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingFeature) {
        await updateData("features", editingFeature, featureData);
        toast.success("Feature updated successfully!");
      } else {
        await addData("features", featureData);
        toast.success("Feature added successfully!");
      }

      setShowForm(false);
      setFormData({ title: "", image: "" });
      setImagePreview(null);
      loadFeatures();
    } catch (error) {
      console.error("Error saving feature:", error);
      toast.error("Error saving feature. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFeature(null);
    setFormData({ title: "", image: "" });
    setImagePreview(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: 0, color: "#333" }}>Feature Management</h2>
          <p style={{ color: "grey", margin: "5px 0 0 0" }}>Manage featured products displayed on the app</p>
        </div>
        <button
          onClick={handleAddFeature}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          <FiPlus size={18} />
          Add Feature
        </button>
      </div>

      {/* Search Bar */}
      <div style={{
        backgroundColor: "whitesmoke",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>
        <div style={{ position: "relative" }}>
          <FiSearch style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#666" }} size={18} />
          <input
            type="text"
            placeholder="Search features by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              paddingLeft: "45px",
              fontSize: "14px"
            }}
          />
        </div>
      </div>

      {/* Features Grid */}
      {loading && features.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading features...</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {filteredFeatures.length === 0 ? (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              backgroundColor: "whitesmoke",
              borderRadius: "10px"
            }}>
              <p style={{ color: "#666" }}>
                {features.length === 0 
                  ? "No features found. Add your first feature!" 
                  : "No features match your search criteria."}
              </p>
            </div>
          ) : (
            filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Image */}
                <div style={{
                  width: "100%",
                  height: "200px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}>
                  {feature.image ? (
                    <img
                      src={feature.image}
                      alt={feature.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <FiImage size={40} color="#ccc" />
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "15px" }}>
                  <h3 style={{
                    margin: "0 0 15px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333"
                  }}>
                    {feature.title}
                  </h3>

                  {/* Actions */}
                  <div style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end"
                  }}>
                    <button
                      onClick={() => handleEditFeature(feature)}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px"
                      }}
                    >
                      <FiEdit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px"
                      }}
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "30px",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h3 style={{ margin: "0 0 20px 0" }}>
              {editingFeature ? "Edit Feature" : "Add New Feature"}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333"
                }}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Bulk Live Chicken - Broilers"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "14px"
                  }}
                />
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333"
                }}>
                  Image *
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div style={{
                    marginBottom: "15px",
                    width: "100%",
                    height: "200px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "2px solid #ddd"
                  }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  required={!formData.image}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "14px"
                  }}
                />
                {uploadingImage && (
                  <p style={{ color: "#007bff", marginTop: "8px", fontSize: "12px" }}>
                    Uploading image...
                  </p>
                )}
                {formData.image && !uploadingImage && (
                  <p style={{ color: "#4caf50", marginTop: "8px", fontSize: "12px" }}>
                    ✓ Image uploaded successfully
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "30px"
              }}>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  style={{
                    backgroundColor: loading || uploadingImage ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: loading || uploadingImage ? "not-allowed" : "pointer",
                    fontSize: "14px"
                  }}
                >
                  {loading ? "Saving..." : editingFeature ? "Update" : "Add Feature"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeatureManagement;

