'use client';

import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAdminStore } from '@/lib/adminStore';

export default function AdminUsersPage() {
  const { token } = useAdminStore();
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);

  useEffect(() => {
    if (!token) return;
    void apiFetch<Array<{ id: string; name: string; email: string; role: string }>>('/admin/users', {}, token)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Users</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Manage team members and admin access.</p>
        </div>
      </div>
      
      <div className="bg-white p-12 rounded-2xl border border-[#EADFD8] shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
         <div className="w-16 h-16 bg-[#F8F5F2] rounded-full flex items-center justify-center text-[#E6C97A] mb-4">
            <Users size={28} />
         </div>
         <h3 className="text-xl font-bold text-[#2B2B2B] font-serif mb-2">Admin Users</h3>
         <p className="text-[#AFAFAF] text-[14px]">{users.length ? users.map((u) => `${u.name} (${u.email})`).join(', ') : 'No users found.'}</p>
      </div>
    </div>
  );
}
