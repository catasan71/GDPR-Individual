import React, { useState, useEffect } from 'react';
import { Users, Building2, FileText, ShieldAlert, Loader2, Search } from 'lucide-react';
import { getAllUsersData } from '../services/dbService';
import { CompanyProfile, DocumentItem } from '../types';

interface AdminDashboardProps {}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [users, setUsers] = useState<{id: string, profile: CompanyProfile, documents: DocumentItem[]}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsersData();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.profile.cui?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  const totalUsers = users.length;
  const totalDocsGenerated = users.reduce((acc, user) => acc + user.documents.filter(d => d.status === 'generated').length, 0);
  const usersWithDPO = users.filter(u => u.profile.employeeCount >= 250 || u.profile.processSensitiveData || u.profile.processCNPLegitimateInterest).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Panou Administrator</h1>
          <p className="text-slate-400">Vedere de ansamblu asupra tuturor clienților și documentelor generate.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Firme</p>
            <p className="text-2xl font-bold text-white">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Documente Generate</p>
            <p className="text-2xl font-bold text-white">{totalDocsGenerated}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Firme cu Risc (DPO)</p>
            <p className="text-2xl font-bold text-white">{usersWithDPO}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Lista Clienți</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Caută firmă sau CUI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Companie</th>
                <th className="px-6 py-4 font-medium">CUI</th>
                <th className="px-6 py-4 font-medium">Industrie</th>
                <th className="px-6 py-4 font-medium">Angajați</th>
                <th className="px-6 py-4 font-medium">Status Documente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map((user) => {
                const generatedDocs = user.documents.filter(d => d.status === 'generated').length;
                const totalDocs = user.documents.length;
                const progress = totalDocs > 0 ? Math.round((generatedDocs / totalDocs) * 100) : 0;

                return (
                  <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-300">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.profile.name || 'N/A'}</p>
                          <p className="text-xs text-slate-500">ID: {user.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.profile.cui || 'N/A'}</td>
                    <td className="px-6 py-4">{user.profile.industry || 'N/A'}</td>
                    <td className="px-6 py-4">{user.profile.employeeCount || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-800 rounded-full h-2 max-w-[100px]">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{generatedDocs}/{totalDocs}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Nu s-au găsit clienți.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
