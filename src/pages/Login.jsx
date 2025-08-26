import React from "react";
import { Link } from "react-router-dom";




export default function Login() {
  return (
    <div>
      <button>
        <a href="/home">go to home</a>
      </button>

      <button>
        <Link to={"/home"}>go to home</Link>
      </button>
    </div>
  );
}
