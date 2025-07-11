// import React from "react";
import { useEffect, useState } from 'react';
import { Briefcase, Rocket, UserCheck, ShieldCheck } from 'lucide-react';
import axiosClient from '../../assets/js/axios-client';
import { useAuth } from '../../context/AuthProvider';

export default function JobSeekerDashboard() {
    // Hardcoded data
    const totalOpportunities = 45;
    const profileCompletion = 85;
    const hasPremium = true;

    const [loading, setLoading] = useState(true);
    const [popularGigs, setPopularGigs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [applications, setApplications] = useState([]);
    const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
    const [totalPopularGigs, setTotalPopularGigs] = useState(0);
    const { user } = useAuth();
    const userId = user?.id;

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const applicationsResponse = await axiosClient.get(`/gig-seeker/applications`, {
                    params: { gig_seeker_id: userId }
                });
                setApplications(applicationsResponse.data);
                setTotalApplicationsCount(applicationsResponse.data.total);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
            try {
                const popularGigsResponse = await axiosClient.get('/popular-gigs');
                setPopularGigs(popularGigsResponse.data);
                setTotalPopularGigs(popularGigsResponse.data.total);
                console.log("Popular gigs fetched:", popularGigsResponse.data);
            } catch (error) {
                console.error("Error fetching popular gigs:", error);
            }
            try {
                const recentApplicationsResponseResponse = await axiosClient.get(`/gig-seeker/recent-applications`, {
                    params: { gig_seeker_id: userId }
                });
                setRecentApplications(recentApplicationsResponseResponse.data);
            } catch (error) {
                console.error("Error fetching recent gigs applications:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchGigs();
    }, []);

    return (
        <div className="">
            <div className="bg-blue-50 rounded-2xl shadow-md">
                <h1 className="text-3xl font-extrabold text-blue-600 mb-2">
                    Hi {user.firstname}, welcome to your Dashboard!
                </h1>
                <p className="text-blue-800 text-lg">
                    Manage your account, track applications, and explore job opportunities.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow border border-blue-100 flex items-center gap-4">
                    <Briefcase className="text-blue-500 w-6 h-6" />
                    <div>
                        <h2 className="text-sm font-medium text-blue-500">Total Applications</h2>
                        <p className="text-3xl font-extrabold text-gray-800 mt-1">{totalApplicationsCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow border border-blue-100 flex items-center gap-4">
                    <Rocket className="text-blue-500 w-6 h-6" />
                    <div>
                        <h2 className="text-sm font-medium text-blue-500">Opportunities Available</h2>
                        <p className="text-3xl font-extrabold text-gray-800 mt-1">{totalPopularGigs}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow border border-blue-100">
                    <h2 className="text-sm font-medium text-blue-500 mb-1 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-blue-500" />
                        Profile Completion
                    </h2>
                    <p className="text-3xl font-extrabold text-gray-800">{profileCompletion}%</p>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${profileCompletion}%` }}
                        ></div>
                    </div>
                </div>

                <div className={`p-6 rounded-2xl shadow border flex items-center gap-4
    ${hasPremium ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <ShieldCheck className={`w-6 h-6 ${hasPremium ? 'text-green-600' : 'text-red-500'}`} />
                    <div>
                        <h2 className="text-sm font-medium text-gray-600">Premium Access</h2>
                        <p className={`text-3xl font-extrabold mt-1 ${hasPremium ? 'text-green-600' : 'text-red-500'}`}>
                            {hasPremium ? "Active" : "Inactive"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Popular Gigs */}
            <div className="w-full bg-white p-6 rounded-2xl shadow border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Popular Gigs
                    </h2>
                    <span className="text-sm text-gray-500">{popularGigs.length} Total</span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <Rocket className="animate-spin h-10 w-10 text-blue-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {popularGigs?.gigs.map((gig) => (
                            <div
                                key={gig.id}
                                className="flex justify-between items-center p-4 rounded-lg shadow bg-gradient-to-r from-blue-600 via-blue-500 to-blue-300 text-white hover:shadow-md transition"
                            >
                                <h3 className="font-semibold text-base truncate">{gig.title}</h3>
                                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                                    {gig.application_count}
                                </span>
                            </div>
                        ))}

                        {popularGigs.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-4">
                                No popular gigs available.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Premium Features */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Premium Features</h2>
                <ul className="space-y-3 text-gray-700 list-disc pl-5">
                    <li>Priority application visibility to recruiters</li>
                    <li>Personalized job recommendations</li>
                    <li>Resume review & tips</li>
                    <li>Early access to exclusive job posts</li>
                </ul>
            </div>

            {/* Recent Applications */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <Rocket className="animate-spin h-10 w-10 text-blue-500" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-sm text-left text-gray-600">
                            <thead className="bg-blue-100 text-blue-600 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-4 py-3">Gig Title</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Date Applied</th>
                                    <th className="px-4 py-3">Amount Deducted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentApplications.map((application) => (
                                    <tr key={application.id} className="border-b border-gray-300 hover:border-transparent hover:bg-blue-50 transition transform ease-out duration-700">
                                        <td className="px-4 py-3">{application.gig?.title || "—"}</td>
                                        <td className="px-4 py-3">{application.gig?.location || "—"}</td>
                                        <td className="px-4 py-3">{new Date(application.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-red-600 font-semibold">
                                            TSh {application.gig?.payment?.toLocaleString() || "0"}
                                        </td>
                                    </tr>
                                ))}
                                {recentApplications.length === 0 && (
                                    <tr>
                                        <td className="px-4 py-4 text-center text-gray-500" colSpan="4">
                                            No gigs applied yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
