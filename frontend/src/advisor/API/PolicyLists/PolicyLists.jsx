import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import VITE_DATA from "../../../config/config";
import TextLoader from "../../../loader/TextLoader";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const PolicyLists = () => {
  const { insuranceName } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState("");
  const [data, setData] = useState([]); // Table data
  const [totalPages, setTotalPages] = useState(0); // Total pages count
  const [currentPage, setCurrentPage] = useState(1); // Current page (1-based)
  const [pageSize, setPageSize] = useState(10); // Number of records per page
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]); // Column filters
  const [showFilters, setShowFilters] = useState({}); // Track visibility of filters for each column
  const [encryptedPolicyId, setEncryptedPolicyId] = useState(null);
  const [rowLoadingStates, setRowLoadingStates] = useState({});
  const baseUrl = window.location.origin;
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(`${VITE_DATA}/tataaig/auth/details`);
        setTokens(response?.data?.auth?.access_token);
      } catch (error) {
        setError(error);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${VITE_DATA}/${insuranceName}/policy/lists`,
          {
            headers: { Authorization: `${token}` },
            params: {
              page: currentPage, // Correct pagination
              limit: pageSize, // Page size from state
            },
          }
        );

        setData(response?.data?.data || []);
        setTotalPages(response?.data?.totalPages || 0);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentPage, pageSize]);

  // api verify payment and download
  const access_token = sessionStorage.getItem("tokens");

  const verifyPayment = async (payment_id) => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `${tokens || access_token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        `${VITE_DATA}/taig/motor/verif/pay`,
        { payment_id },
        { headers }
      );

      if (response.data.status === 200) {
        const encryptedId = response?.data?.data?.encrypted_policy_id;
        setEncryptedPolicyId(encryptedId);
        toast.success(response?.data?.message); // Changed to `toast.success` for successful verification
      } else {
        toast.error(response?.data?.message_txt || response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        window.location.href = `${baseUrl}/login`;
      } else {
        toast.error(`${error?.response?.data?.message_txt || error?.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPolicy = async (encrypted_policy_id) => {
    setIsDownloading(true);
    try {
      const headers = {
        Authorization: `${tokens || access_token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${VITE_DATA}/taig/motor/download/policy/${encrypted_policy_id}`,
        { headers }
      );
      const { data } = response;
      const binaryData = atob(data?.byteStream);
      const arrayBuffer = new Uint8Array(binaryData?.length);
      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "policy.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Policy downloaded successfully!");
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const columns = useMemo(
    () => [
      { header: "Policy No.", accessorKey: "payment.policy_no" },
      { header: "Policy ID", accessorKey: "data.policy_id" },
      { header: "Quote ID", accessorKey: "data.quote_id" },
      { header: "Proposal ID", accessorKey: "data.proposal_id" },
      { header: "Document ID", accessorKey: "data.document_id" },
      { header: "Nstp ID", accessorKey: "proposalData.nstp_id" },
      { header: "Quote No", accessorKey: "data.quote_no" },
      { header: "Proposal No", accessorKey: "proposalData.proposal_no" },
      {
        header: "Vehicle No",
        accessorFn: (row) => {
          const { regno_1, regno_2, regno_3, regno_4 } = row.data;
          return `${regno_1 || ""} ${regno_2 || ""} ${regno_3 || ""} ${
            regno_4 || ""
          }`.trim();
        },
      },
      // { header: "Prev. Policy End Date", accessorKey: "data.prev_pol_end_date" },
      // { header: "Prev. Policy Start Date", accessorKey: "data.prev_pol_start_date" },
      { header: "Date of Reg.", accessorKey: "data.dor" },
      { header: "MFG Year", accessorKey: "data.man_year" },
      { header: "Policy Start Date", accessorKey: "data.pol_start_date" },
      { header: "Policy End Date", accessorKey: "data.pol_end_date" },
      { header: "Proposer Type", accessorKey: "data.proposer_type" },
      { header: "Business Type", accessorKey: "data.business_type" },
      { header: "Policy Plan Variant", accessorKey: "data.pol_plan_variant" },
      {
        header: "Vehicle Make",
        accessorFn: (row) => {
          const { vehicle_make_no, vehicle_make } = row.data;
          return `(${vehicle_make_no || ""}) ${vehicle_make || ""}`;
        },
      },
      {
        header: "Vehicle Model",
        accessorFn: (row) => {
          const { vehicle_model_no, vehicle_model } = row.data;
          return `(${vehicle_model_no || ""}) ${vehicle_model || ""}`;
        },
      },
      {
        header: "Vehicle Variant",
        accessorFn: (row) => {
          const { vehicle_variant_no, vehicle_variant } = row.data;
          return `(${vehicle_variant_no || ""}) ${vehicle_variant || ""}`;
        },
      },
      { header: "Wheels", accessorKey: "pol_dlts.vehicle_wheels" },
      { header: "Body", accessorKey: "pol_dlts.vehicle_body" },
      { header: "Wheels", accessorKey: "pol_dlts.vehicle_wheels" },
      { header: "CC", accessorKey: "data.cc" },
      { header: "Min Idv", accessorKey: "data.min_idv" },
      { header: "Max Idv", accessorKey: "data.max_idv" },
      { header: "Total Idv", accessorKey: "pol_dlts.total_idv" },
      { header: "Comp. Excess", accessorKey: "pol_dlts.compulsory_excess" },
      {
        header: "CPA",
        accessorFn: (row) => {
          const { cpa_start, cpa_end } = row.pol_dlts;
          return `${cpa_start || ""}  ${cpa_end || ""}`;
        },
      },
      {
        header: "Reg. Place",
        accessorFn: (row) => {
          const { place_reg_no, place_reg } = row.data;
          return `(${place_reg_no || ""}) ${place_reg || ""}`;
        },
      },
      {
        header: "Segment",
        accessorFn: (row) => {
          const { segment_code, segment } = row.data;
          return `${segment_code || ""} ${segment || ""}`;
        },
      },
      { header: "Fuel", accessorKey: "pol_dlts.vehicle_fuel" },
      { header: "Seating", accessorKey: "pol_dlts.vehicle_seating" },
      { header: "Price No.", accessorKey: "pol_dlts.vehicle_price_no" },
      { header: "Discount", accessorKey: "pol_dlts.total_discount" },
      { header: "Price", accessorKey: "pol_dlts.vehicle_price" },
      { header: "De Tariff", accessorKey: "pol_dlts.detariff" },
      { header: "City", accessorKey: "pol_dlts.proposer_city" },
      { header: "State", accessorKey: "pol_dlts.proposer_state" },
      { header: "Mobile", accessorKey: "data.mobile_no" },
      { header: "Pincode", accessorKey: "data.proposer_pincode" },
      { header: "Motor Plan", accessorKey: "pol_dlts.motor_plan_opted" },
      { header: "OD Tenure", accessorKey: "pol_dlts.od_tenure" },
      {
        header: "Basic OD",
        accessorKey: "data.premium_break_up.total_od_premium.od.basic_od",
      },
      {
        header: "Total OD Prem.",
        accessorKey: "data.premium_break_up.total_od_premium.total_od",
      },
      // { header: "Total AddOns", accessorKey: "data.total_addOns.total_addon" },
      { header: "TP Tenure", accessorKey: "pol_dlts.tp_tenure" },
      // { header: "Basic TP", accessorKey: "data.total_tp_premium.basic_tp" },
      // { header: "Total TP Prem.", accessorKey: "data.total_tp_premium.total_tp" },
      {
        header: "Total TP Prem.",
        accessorKey: "data.total_tp_premium.total_tp",
      },
      {
        header: "Final Prem.",
        accessorKey: "data.premium_break_up.final_premium",
      },
      { header: "SGST @9", accessorKey: "data.premium_break_up.sgst_prem" },
      { header: "CGST @9", accessorKey: "data.premium_break_up.cgst_prem" },
      { header: "Net Prem.", accessorKey: "data.premium_break_up.net_premium" },
      { header: "Ticket No.", accessorKey: "proposalData.ticket_number" },
      {
        header: "Self Insp. Link",
        accessorKey: "proposalData.self_inspection_link",
        cell: (info) => {
          const link = info?.getValue();
          // Render the button only if the link exists
          return link ? (
            <a
              href={link}
              target="_blank"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer px-2 py-1 font-medium"
              rel="noopener noreferrer"
            >
              Open Link
            </a>
          ) : null;
        },
      },
      { header: "Doc Type", accessorKey: "ovdData.doc_type" },
      {
        header: "Registered Name",
        accessorKey: "ovdData.result.registered_name",
      },
      { header: "Gender", accessorKey: "ovdData.result.gender" },
      { header: "Age", accessorKey: "ovdData.result.age" },
      { header: "City", accessorKey: "ovdData.result.p_address.city" },
      { header: "State", accessorKey: "ovdData.result.p_address.state" },
      { header: "Pincode", accessorKey: "ovdData.result.p_address.pincode" },
      {
        header: "Verify / Download",
        accessorFn: (row) => {
          const { encrypted_policy_id, encrypted_policy_no } =
            row.payment || {};
          const { payment_id } = row.proposalData || {};
          const pay_id = row?.inspectionStatus?.policy[0]?.payment_id;

          return {
            encrypted_policy_id,
            encrypted_policy_no,
            payment_id,
            pay_id,
          };
        },
        cell: (info) => {
          const { encrypted_policy_id, payment_id, pay_id } = info.getValue();
          const rowId = encrypted_policy_id || payment_id || pay_id; // Unique identifier for the row
          const isRowLoading = rowLoadingStates[rowId]; // Check if this row is in a loading state

          return (
            <div className="flex justify-center items-center text-center">
              {encrypted_policy_id ? (
                <button
                  onClick={async () => {
                    // Set loading state for this row
                    setRowLoadingStates((prev) => ({ ...prev, [rowId]: true }));
                    try {
                      await downloadPolicy(
                        encrypted_policy_id || encryptedPolicyId
                      );
                    } catch (error) {
                      console.error("Download failed:", error);
                    } finally {
                      // Reset loading state for this row
                      setRowLoadingStates((prev) => ({
                        ...prev,
                        [rowId]: false,
                      }));
                    }
                  }}
                  disabled={isRowLoading}
                  className={`px-3 py-1 text-center rounded ${
                    isRowLoading
                      ? "bg-gray-600 cursor-not-allowed "
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white font-medium tracking-wider`}
                >
                  {isRowLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Download"
                  )}
                </button>
              ) : (
                <button
                  onClick={async () => {
                    // Set loading state for this row
                    setRowLoadingStates((prev) => ({ ...prev, [rowId]: true }));
                    try {
                      await verifyPayment(payment_id || pay_id);
                    } catch (error) {
                      console.error("Verification failed:", error);
                    } finally {
                      // Reset loading state for this row
                      setRowLoadingStates((prev) => ({
                        ...prev,
                        [rowId]: false,
                      }));
                    }
                  }}
                  disabled={isRowLoading}
                  className={`px-3 py-1 text-center rounded ${
                    isRowLoading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-slate-600 hover:bg-slate-700"
                  } text-white font-medium tracking-wider`}
                >
                  {isRowLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </button>
              )}
            </div>
          );
        },
      },
      {
        header: "Quote",
        accessorFn: (row) => {
          const { quote_stage } = row;
          return { quote_stage };
        },
        cell: (info) => {
          const { quote_stage } = info.getValue();
          const renderStage = (stage) => {
            if (!stage) return null;
            return (
              <span
                className={`${
                  stage === "completed" || stage === "Completed"
                    ? "bg-green-600"
                    : stage === "pending" || stage === "Pending"
                    ? "bg-red-600"
                    : ""
                } px-2 pb-0.5 rounded`}
              >
                {stage}
              </span>
            );
          };
          return (
            <div className="flex justify-center items-center  text-center text-white  font-medium tracking-wider">
              {renderStage(quote_stage)}
            </div>
          );
        },
      },
      {
        header: "Proposal",
        accessorFn: (row) => {
          const { proposal_stage } = row.proposalData || {};
          return { proposal_stage };
        },
        cell: (info) => {
          const { proposal_stage } = info.getValue();
          const renderStage = (stage) => {
            if (!stage) return null;
            return (
              <div
                className={`${
                  stage === "completed" || stage === "Completed"
                    ? "bg-green-600"
                    : stage === "pending" || stage === "Pending"
                    ? "bg-red-600"
                    : ""
                }  px-2 pb-0.5 rounded`}
              >
                {stage}
              </div>
            );
          };
          return (
            <div className="flex justify-center items-center  text-center text-white  font-medium tracking-wider">
              {renderStage(proposal_stage)}
            </div>
          );
        },
      },
      {
        header: "Inspection",
        accessorFn: (row) => {
          const { inspection_status } = row.inspectionStatus || {};
          return { inspection_status };
        },
        cell: (info) => {
          const { inspection_status } = info.getValue();
          const renderStage = (stage) => {
            if (!stage) return null;
            return (
              <span
                className={`${
                  stage === "completed" || stage === "Completed"
                    ? "bg-green-600"
                    : stage === "pending" || stage === "Pending"
                    ? "bg-red-600"
                    : ""
                } px-2 pb-0.5 rounded`}
              >
                {stage}
              </span>
            );
          };
          return (
            <div className="flex justify-center items-center text-center text-white font-medium tracking-wider">
              {renderStage(inspection_status)}
            </div>
          );
        },
      },
      {
        header: "KYC / OVD",
        accessorFn: (row) => {
          const { verified } = row.ovdData || {};
          return { verified };
        },
        cell: (info) => {
          const { verified } = info.getValue();
          const renderStage = (stage) => {
            if (!stage) return null;
            return (
              <div
                className={`${
                  verified ? "bg-green-600" : "bg-red-600"
                }  px-2 pb-0.5 rounded`}
              >
                {verified ? "Completed" : "Pending"}
              </div>
            );
          };
          return (
            <div className="flex justify-center items-center  text-center text-white  font-medium tracking-wider">
              {renderStage(verified)}
            </div>
          );
        },
      },
      {
        header: "Payment",
        accessorFn: (row) => {
          const { payment_status } = row.payment || {};
          return { payment_status };
        },
        cell: (info) => {
          const { payment_status } = info.getValue();
          const renderStage = (stage) => {
            if (!stage) return null;
            return (
              <div
                className={`${
                  payment_status === "Success" ? "bg-green-600" : "bg-red-600"
                }  px-2 pb-0.5 rounded`}
              >
                {payment_status}
              </div>
            );
          };
          return (
            <div className="flex justify-center items-center  text-center text-white  font-medium tracking-wider">
              {renderStage(payment_status)}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isDownloading,
      isLoading,
      downloadPolicy,
      rowLoadingStates,
      encryptedPolicyId,
    ]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      pagination: { pageIndex: currentPage - 1, pageSize },
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // Backend pagination
    pageCount: totalPages, // Set total pages from backend
  });

  // Toggle filter visibility for a column
  const toggleFilter = (columnId) => {
    setShowFilters((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  if (loading) return <TextLoader />;
  if (error)
    return (
      <div className="text-red-500 text-center">Error: {error.message}</div>
    );

  return (
    <div className="flex flex-col shadow-lg  rounded overflow-y-auto grow px-1">
      <div className="flex justify-between my-1">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1); // Reset to first page on page size change
          }}
          className="ps-2 border border-blue-300 rounded"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <h1 className="md:text-2xl text-lg text-transparent bg-gradient-to-l bg-clip-text from-indigo-600 to-blue-500 font-bold">
          {insuranceName
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h1>
        <h1></h1>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100 whitespace-nowrap">
          {table.getHeaderGroups().map((headerGroup, idx) => (
            <tr key={idx}>
              {headerGroup?.headers.map((header, index) => (
                <th
                  key={index}
                  className=" border border-gray-300 text-left  tracking-wider relative"
                >
                  <div className="flex items-center justify-between text-blue-600">
                    <div
                      className="cursor-pointer flex items-center"
                      onClick={header?.column?.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header?.column?.columnDef?.header,
                        header?.getContext()
                      )}
                      {header?.column?.getIsSorted() === "asc" ? " 🔼" : ""}
                      {header?.column?.getIsSorted() === "desc" ? " 🔽" : ""}
                    </div>
                    {/* <button
                      onClick={() => toggleFilter(header.column.id)}
                      className="ml-2 p-1 rounded hover:bg-blue-500 hover:text-white"
                    >
                      {showFilters[header.column.id] ? "▲" : "▼"}
                    </button> */}
                    <button
                      onClick={() => {
                        if (showFilters[header?.column?.id]) {
                          header?.column.setFilterValue(""); // Clear the filter value when closing
                        }
                        toggleFilter(header?.column?.id); // Toggle filter visibility
                      }}
                      className="ml-2 p-1 rounded hover:bg-blue-500 hover:text-white"
                    >
                      {showFilters[header?.column?.id] ? "▲" : "▼"}
                    </button>
                  </div>
                  {showFilters[header?.column?.id] && (
                    <div className="my-1">
                      <input
                        type="text"
                        placeholder={`${header?.column?.columnDef?.header}`}
                        value={header?.column?.getFilterValue() || ""}
                        onChange={(e) =>
                          header?.column?.setFilterValue(e.target.value)
                        }
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table?.getRowModel()?.rows?.map((row, didx) => (
            <tr key={didx} className="border border-gray-300">
              {row?.getVisibleCells().map((cell, indexes) => (
                <td
                  key={indexes}
                  className="p-3 border border-gray-300 whitespace-nowrap odd:bg-slate-50 text-center"
                >
                  {flexRender(
                    cell?.column?.columnDef?.cell,
                    cell?.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-4 my-2 font-medium tracking-wide">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>
          Page <strong>{currentPage}</strong> of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-blue-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PolicyLists;
