import { useEffect, useReducer, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "motion/react";
import { useAppContext } from "../../../../../context/Context";
/* eslint-disable react/prop-types */
const initialFormState = {
  proposal_no: "",
  id_type: "Form60",
  doc_type: "",
  doc_base64: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROPOSAL_NO":
      return { ...state, proposal_no: action.payload };
    case "SET_DOC_TYPE":
      return { ...state, doc_type: action.payload };
    case "SET_DOC_BASE64":
      return { ...state, doc_base64: action.payload };
    case "RESET_FORM":
      return initialFormState;
    default:
      return state;
  }
};

function FormSixty({
  onSubmitFormSixty,
  setFormSixtyState,
  setIsPopupKycOpen,
  handleFileUpload
}) {
  const { state } = useAppContext();
  const proposal = state.tata.privateCar.proposer;
  const ckyc = state.tata.privateCar.ckyc;
  const sixty = state.tata.privateCar.form60.req_id;
  const [formState, dispatch] = useReducer(formReducer, {
    ...initialFormState,
    proposal_no: proposal.proposal_no || "",
  });

  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [docs, setDocs] = useState("");
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (ckyc?.verified) {
      setFormSixtyState(false);
    }
  }, [ckyc?.verified, setFormSixtyState]);

  const handleChange = (e) => {
    const { type, checked } = e.target;
    if (type === "checkbox") {
      setCheck(checked);
    }
  };

  const handleFileSelect = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    handleFileUpload(file, ({ base64String, fileType, fileName }) => {
      dispatch({ type: "SET_DOC_BASE64", payload: base64String });
      dispatch({ type: "SET_DOC_TYPE", payload: fileType });
      setDocs(URL.createObjectURL(file));
      setFileName(fileName);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    handleFileUpload(file, ({ base64String, fileType, fileName }) => {
      dispatch({ type: "SET_DOC_BASE64", payload: base64String });
      dispatch({ type: "SET_DOC_TYPE", payload: fileType });
      setDocs(URL.createObjectURL(file));
      setFileName(fileName);
      setDragOver(false);
    });
  };

  const handleSubmit = () => {
    if (check) {
      onSubmitFormSixty(formState);
    } else {
      toast.error("Please check the checkbox before submitting.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col min-h-64 mb-20 p-6 border border-gray-200 rounded shadow bg-gray-100 mx-2"
      >
        <h1 className="text-sm tracking-wider text-start md:text-base font-medium space-x-2 md:space-x-4">
          Upload Form60
          <span className="text-red-500 font-extrabold">*</span>
        </h1>
        <div className="flex flex-col min-w-full justify-between space-y-3">
          <label
            htmlFor="files"
            className={`w-full min-h-64 cursor-pointer flex items-center flex-col justify-center border transition-all ${
              dragOver
                ? "border-blue-500 bg-blue-100"
                : "border-gray-500 bg-gray-200"
            } border-dashed relative overflow-hidden`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {formState.doc_base64 ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                {formState.doc_type.includes("image") ? (
                  <img src={docs} className="max-h-48 w-auto object-contain" alt="Preview" />
                ) : formState.doc_type.includes("pdf") && (
                  <div className="w-full h-full min-h-[300px]">
                    <iframe
                      src={`${docs}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full"
                      style={{ border: "none" }}
                      title="PDF Preview"
                    />
                  </div>
                )}
                <p className="mt-4 text-gray-700">{fileName}</p>
              </div>
            ) : (
              <>
                <p className="text-lg font-medium">Click or Drag and Drop</p>
                <span className="mt-2 text-sm text-gray-600 italic">
                  Allowed file types: jpg/png/pdf, Max Size limit of 10 MB
                </span>
              </>
            )}
          </label>
          <input
            className="hidden"
            id="files"
            type="file"
            onChange={handleFileSelect}
            accept="image/jpeg, image/png, application/pdf"
          />

          {sixty?.split("_")[0] !== "form60" && (
            <div className="flex items-center gap-3">
              <input
                className="flex text-start border cursor-pointer border-gray-600 outline-none peer focus:ring-0 focus:border-blue-700 checked:border-none rounded h-6 w-6"
                type="checkbox"
                checked={check}
                onChange={handleChange}
              />
              <span className="font-medium tracking-wide">
                I hereby declare that I do not possess a PAN Card and will submit Form60.
              </span>
            </div>
          )}

          <div className="flex justify-center items-center">
            {sixty?.split("_")[0] !== "form60" ? (
              <button
                onClick={handleSubmit}
                className={`${
                  !check
                    ? "cursor-not-allowed bg-gray-500 border-gray-700"
                    : "cursor-pointer bg-blue-600 border-blue-700"
                } transition-all text-base mt-10 text-white font-mono font-bold px-4 py-2 tracking-wider rounded border-b-[3px] hover:brightness-110 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[1px] active:text-slate-400`}
                type="submit"
                disabled={!check}
              >
                Submit
              </button>
            ) : (
              <button
                className="transition-all text-base bg-blue-600 text-white font-mono font-bold px-4 py-1 tracking-wider rounded border-blue-700 border-b-[3px] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[1px] active:text-slate-400"
                onClick={() => setIsPopupKycOpen(true)}
              >
                Open
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FormSixty;

export const PdfPreviewModal = ({ isOpen, onClose, pdfUrl }) => {
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex backdrop-blur-md justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative bg-white mt-5 rounded-lg shadow-lg w-[80%] max-w-4xl h-[88%]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">PDF Preview</h2>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
            >
              <AiOutlineClose
                size={24}
                className="hover:bg-blue-500 hover:text-white transition-all rounded"
              />
            </button>
          </div>
          <div className="h-full">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              style={{ border: "none" }}
              title="PDF Preview"
            ></iframe>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
