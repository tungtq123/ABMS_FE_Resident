import React, { useState, useEffect, useContext } from 'react';
import { FileText } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getBillsByUser } from '../services/billService';
import BillStats from '../components/bills/BillStats';
import BillFilter from '../components/bills/BillFilter';
import BillItem from '../components/bills/BillItem';

export default function BillList() {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [bills, setBills] = useState([]);
  const [periodCode, setPeriodCode] = useState('');
  const [apartmentCode, setApartmentCode] = useState('');
  const [filterStatus, setFilterStatus] = useState(() => searchParams.get('status') || 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      // Use debounce or timeout to avoid fetching every keystroke
      const delayDebounceFn = setTimeout(() => {
        loadBills();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setLoading(false);
    }
  }, [user, filterStatus, periodCode, apartmentCode]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const params = { size: 100 };
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (periodCode) {
        params.periodCode = periodCode;
      }
      if (apartmentCode) {
        params.apartmentCode = apartmentCode;
      }
      
      const res = await getBillsByUser(user.id, params);
      if (res.result?.data) {
         setBills(res.result.data);
      } else {
         setBills([]);
      }
    } catch (err) {
      console.error("Failed to load bills", err);
    } finally {
      setLoading(false);
    }
  };

  // Local filtering is now done directly from the backend response.
  const filteredBills = bills;

  const stats = {
    total: bills.length,
    paid: bills.filter(b => b.status === 'PAID').length,
    unpaid: bills.filter(b => b.status === 'UNPAID').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Hóa đơn</h1>
                <p className="text-blue-100 text-sm">Quản lý các hóa đơn thanh toán của bạn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {!loading && bills.length > 0 && (
          <BillStats stats={stats} />
        )}
        
        <BillFilter 
           periodCode={periodCode} 
           setPeriodCode={setPeriodCode} 
           apartmentCode={apartmentCode}
           setApartmentCode={setApartmentCode}
           filterStatus={filterStatus} 
           setFilterStatus={setFilterStatus} 
        />

        {loading ? (
           <div className="flex justify-center py-10">Đang tải biểu mẫu...</div>
        ) : (
          <>
            {/* Bill List */}
            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <BillItem key={bill.id} bill={bill} />
              ))}
            </div>

            {filteredBills.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-100 mt-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy hóa đơn</h3>
                <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}