import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import TextLoader from '../../loader/TextLoader.jsx';
import VITE_DATA from "../../config/config.jsx";
import { Calendar, Clock, ArrowRight, Info, CheckCircle2, XCircle, Clock as Pending } from 'lucide-react';

function ListOfLeave() {
    const employeeId = sessionStorage.getItem('employeeId');
    const [APIData, setAPIData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Not Authorized yet.. Try again! ");
            setLoading(false);
        } else {
            axios
                .get(`${VITE_DATA}/api/employee/${employeeId}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                })
                .then((response) => {
                    setAPIData(response.data.leaveDetails || []);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Failed to load leave history");
                    setLoading(false);
                });
        }
    }, [employeeId]);

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return <CheckCircle2 className="mr-1 h-4 w-4" />;
            case 'rejected':
                return <XCircle className="mr-1 h-4 w-4" />;
            default:
                return <Pending className="mr-1 h-4 w-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <section className="container-fluid mx-2 pt-4">
            <div className="max-w-full sm:ml-48">
                <div className="text-center mb-6">
                    <h1 className='text-3xl font-bold text-blue-800 mb-2'>Leave History</h1>
                </div>
                {loading ? 
                        <TextLoader />      
                 : APIData.length === 0 ? (
                    <div className="text-center py-80 bg-white rounded shadow-sm border border-blue-100">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                            <Info className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No leave history found</h3>
                        <p className="mt-1 text-sm text-gray-500">You haven&apos;t applied for any leaves yet.</p>
                    </div>
                ) : (
                    <div className=" grid sm:grid-cols-3 gap-8">
                        {APIData.map((data, index) => (
                            <div key={index} className="bg-blue-50 rounded shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex sm:flex-row sm:items-center justify-between mb-4 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="col-span-2 flex items-center bg-blue-50 py-1 rounded-full text-sm font-medium text-blue-800">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {data.applyDate}
                                            </div>
                                            <div className="flex items-center bg-blue-50 px-6 py-1 rounded-full text-sm font-medium text-blue-800">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {data.applytime}
                                            </div>
                                        </div>
                                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(data.status)}`}>
                                            {getStatusIcon(data.status)}
                                            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                                        </div>
                                    </div>

                                    {/* Leave Details */}
                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-4 ">
                                        <div className="space-y-2 sm:col-span-2">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Period</h3>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-900 font-medium">{data.dateRange.startDate}</span>
                                                <ArrowRight className="text-gray-400 h-4 w-4" />
                                                <span className="text-gray-900 font-medium">{data.dateRange.endDate}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Type</h3>
                                            <p className="text-gray-900 font-medium">{data.leavetype}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</h3>
                                            <p className="text-gray-900 font-medium">{data.counts} day{data.counts !== 1 ? 's' : ''}</p>
                                        </div>

                                        <div className="space-y-2 sm:col-span-2">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</h3>
                                            <p className="text-gray-900 font-medium">{data.reasonForLeave || '-'}</p>
                                        </div>
                                  

                                    {/* Remarks (if exists) */}
                                    {data.remarks && (
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks</h3>
                                            <p className="text-gray-700 mt-1">{data.remarks}</p>
                                        </div>
                                     )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ListOfLeave;