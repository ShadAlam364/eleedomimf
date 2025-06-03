import { useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../../context/Context";
import {PdfPreviewModal} from "../CarForm60/FormSixty"
import PropTypes from "prop-types";

const initialState = {
  formData: {
    id_type: "OVD",
    doc_type: "",
    doc_base64: "",
  },
  fileName: "",
  dragOver: false,
  docs: "",
  isModalOpen: false,
  check: false,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "SET_FILE_NAME":
      return { ...state, fileName: action.payload };
    case "SET_DRAG_OVER":
      return { ...state, dragOver: action.payload };
    case "SET_DOCS":
      return { ...state, docs: action.payload };
    case "SET_MODAL_OPEN":
      return { ...state, isModalOpen: action.payload };
    case "SET_CHECK":
      return { ...state, check: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

function OvdForm({ onSubmit, handleFileUpload }) {
  const { state } = useAppContext();
  const proposal = state.tata.privateCar.proposer;
  const ckyc = state.tata.privateCar.ckyc;

  // Initialize formData with proposal number if available
  const [formState, dispatchForm] = useReducer(reducer, {
    ...initialState,
    formData: {
      ...initialState.formData,
      req_id: ckyc?.data?.req_id || ckyc?.req_id,
      proposal_no: proposal?.proposal_no || "",
    }
  });

  const handleFileSelect = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    handleFileUpload(file, ({ base64String, fileType, fileName }) => {
      dispatchForm({ 
        type: "SET_FORM_DATA", 
        payload: { 
          doc_base64: base64String, 
          doc_type: fileType 
        } 
      });
      dispatchForm({ type: "SET_DOCS", payload: URL.createObjectURL(file) });
      dispatchForm({ type: "SET_FILE_NAME", payload: fileName });
      dispatchForm({ type: "SET_MODAL_OPEN", payload: fileType === "pdf" });
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    handleFileUpload(file, ({ base64String, fileType, fileName }) => {
      dispatchForm({ 
        type: "SET_FORM_DATA", 
        payload: { 
          doc_base64: base64String, 
          doc_type: fileType 
        } 
      });
      dispatchForm({ type: "SET_DOCS", payload: URL.createObjectURL(file) });
      dispatchForm({ type: "SET_FILE_NAME", payload: fileName });
      dispatchForm({ type: "SET_DRAG_OVER", payload: false });
      dispatchForm({ type: "SET_MODAL_OPEN", payload: fileType === "pdf" });
    });
  };

  const handleSubmit = () => {
    if (formState.check) {
      onSubmit(formState.formData);
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
        className="block min-h-64 mb-20 p-6 border border-gray-200 rounded shadow bg-gray-100"
      >
        <h1 className="text-sm tracking-wider text-start md:text-base font-medium space-x-2 md:space-x-4">
          Upload OVD
          <span className="text-red-500 font-extrabold">*</span>
        </h1>
        <div className="flex flex-col min-w-full justify-between space-y-3">
          <label
            htmlFor="ovd"
            className={`w-full min-h-32 cursor-pointer flex items-center flex-col justify-center border transition-all ${
              formState.dragOver
                ? "border-blue-500 bg-blue-100"
                : "border-gray-500 bg-gray-200"
            } border-dashed`}
            onDragOver={(e) => {
              e.preventDefault();
              dispatchForm({ type: "SET_DRAG_OVER", payload: true });
            }}
            onDragLeave={() => dispatchForm({ type: "SET_DRAG_OVER", payload: false })}
            onDrop={handleDrop}
          >
            {formState.formData.doc_base64 ? (
              <>
                {["image"].some((type) => formState.formData.doc_type.includes(type)) && (
                  <img src={formState.docs} className="h-28 mt-2 w-auto" alt="Preview" />
                )}
                <PdfPreviewModal
                  pdfUrl={formState.docs}
                  isOpen={formState.formData.doc_type.includes("pdf") && formState.isModalOpen}
                  onClose={() => dispatchForm({ type: "SET_MODAL_OPEN", payload: false })}
                />
                <p className="my-2">{formState.fileName}</p>
                {formState.formData.doc_type.includes("pdf") && (
                  <button
                    className="transition-all text-base bg-blue-600 text-white font-mono font-bold px-4 py-1 tracking-wider rounded border-blue-700 border-b-[3px] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[1px] active:text-slate-400"
                    onClick={() => dispatchForm({ type: "SET_MODAL_OPEN", payload: true })}
                  >
                    Preview
                  </button>
                )}
              </>
            ) : (
              <>
                <p>Click or Drag and Drop</p>
                <span className="flex mt-2 font-mono text-start italic text-sm">
                  &quot;Allowed file types:jpg/png/pdf, Max Size limit of 10 MB
                  for each file.&quot;
                </span>
              </>
            )}
          </label>
          <input
            className="hidden w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none"
            aria-describedby="user_avatar_help"
            id="ovd"
            type="file"
            onChange={handleFileSelect}
            accept="image/jpeg, image/png, application/pdf"
          />

          <div className="flex items-center gap-3">
            <input
              className="flex text-start border cursor-pointer border-gray-600 outline-none peer focus:ring-0 focus:border-blue-700 checked:border-none rounded h-6 w-6"
              type="checkbox"
              onChange={(e) => dispatchForm({ type: "SET_CHECK", payload: e.target.checked })}
            />
            <span className="font-medium tracking-wide">
              I hereby declare that I do not possess a PAN and will submit OVD.
            </span>
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={handleSubmit}
              className={`${
                !formState.check || formState.loading
                  ? "cursor-not-allowed bg-gray-500 border-gray-700"
                  : "cursor-pointer bg-blue-600 border-blue-700"
              } transition-all text-base mt-10 text-white font-mono font-bold px-4 py-2 tracking-wider rounded border-b-[3px] hover:brightness-110 disabled:cursor-not-allowed active:border-b-[2px] active:brightness-90 active:translate-y-[1px] active:text-slate-400`}
              type="submit"
              disabled={!formState.check || formState.loading}
            >
              {formState.loading ? "Please Wait..." : "Submit"}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

OvdForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired
};

export default OvdForm;
