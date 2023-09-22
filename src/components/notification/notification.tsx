import { Slide, TypeOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notify = (text: string, type: TypeOptions) =>
  toast(text, {
    type,
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Slide,
  });
