import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, Search, Plus, Trash2, Edit, 
  RefreshCw, ChevronLeft, ChevronRight, CheckCircle, AlertCircle,
  MapPin, Eye, X, Home, Maximize2, Calendar, Info
} from "lucide-react";
import { fetchBuildings, deleteBuilding, generateApartments } from "../../services/buildingApi"; 

export default function BuildingList() {
  const navigate = useNavigate();

  // --- STATES ---
  const [searchInput, setSearchInput] = useState(""); 
  const [activeSearch, setActiveSearch] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // State cho Modal chi tiết
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadBuildings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBuildings(currentPage, pageSize, activeSearch);
      if (data.code === 200 && data.result) {
        setBuildings(data.result.data || []);
        setTotalPages(data.result.totalPages || 0);
        setTotalElements(data.result.totalItems || 0);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, [currentPage, pageSize, activeSearch]);

  useEffect(() => { loadBuildings(); }, [loadBuildings]);

  // --- ACTIONS ---
  const handleOpenDetail = (building) => {
    setSelectedBuilding(building);
    setShowModal(true);
  };


  
  const handleGenerate = async (id) => {
    if (!window.confirm("Bắt đầu sinh căn hộ tự động cho tòa nhà này?")) return;
    const res = await generateApartments(id);
    if (res.code === 200) {
      alert("Sinh căn hộ thành công!");
      setShowModal(false);
      loadBuildings();
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Xóa tòa nhà "${name}"?`)) {
      const res = await deleteBuilding(id);
      if (res.code === 200) loadBuildings();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* 1. HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" /> Quản lý Tòa nhà
          </h1>
          <p className="text-gray-500 text-sm">Danh sách rút gọn các dự án vận hành</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text" placeholder="Tìm kiếm nhanh..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSearch(searchInput)}
            />
          </div>
          <button onClick={() => navigate('/add-building')} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* 2. COMPACT TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tòa nhà</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Số tầng</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="py-10 text-center text-blue-600 animate-pulse font-medium">Đang tải...</td></tr>
            ) : buildings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-blue-600 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-lg text-[10px]">{b.code}</div>
                    <div>
                      <div className="font-bold text-gray-800">{b.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} />{b.address.split(',')[0]}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-600">{b.numFloors} Tầng</td>
                <td className="px-6 py-4">
                  {b.apartmentsGenerated ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-black uppercase">Đã sinh {b.currentApartmentCount} căn</span>
                  ) : (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-[10px] font-black uppercase">Chờ khởi tạo</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => handleOpenDetail(b)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Xem chi tiết"><Eye size={18} /></button>
                    <button onClick={() => navigate(`/buildings/edit/${b.id}`)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(b.id, b.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="p-4 bg-gray-50/30 flex justify-between items-center border-t border-gray-50">
          <span className="text-xs text-gray-400">Trang {currentPage + 1} / {totalPages}</span>
          <div className="flex gap-1">
            <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} className="p-1 disabled:opacity-20"><ChevronLeft size={18}/></button>
            <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)} className="p-1 disabled:opacity-20"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {/* 3. DETAIL MODAL (Dùng cho "Xem chi tiết") */}
      {showModal && selectedBuilding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white"><Info size={20}/></div>
                <h2 className="text-lg font-black text-gray-800">Chi tiết Tòa nhà</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Tên & Mã tòa nhà</label>
                  <div className="text-lg font-black text-blue-600 uppercase">{selectedBuilding.code} - {selectedBuilding.name}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Địa chỉ</label>
                  <div className="text-sm font-medium text-gray-600 flex items-center gap-1"><MapPin size={14}/> {selectedBuilding.address}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Thời gian tạo</label>
                  <div className="text-sm font-medium text-gray-600 flex items-center gap-1"><Calendar size={14}/> {selectedBuilding.createdAt}</div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Cấu hình diện tích & loại phòng */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-3 block">Cấu hình loại phòng & Diện tích</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="text-[10px] font-bold text-blue-400 uppercase">1 BR</div>
                    <div className="text-sm font-black text-blue-700">{selectedBuilding.apartmentsPerFloor1br} Căn/Tầng</div>
                    <div className="text-xs text-blue-500 font-bold">{selectedBuilding.area1brSqm} m²</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="text-[10px] font-bold text-purple-400 uppercase">2 BR</div>
                    <div className="text-sm font-black text-purple-700">{selectedBuilding.apartmentsPerFloor2br} Căn/Tầng</div>
                    <div className="text-xs text-purple-500 font-bold">{selectedBuilding.area2brSqm} m²</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">3 BR</div>
                    <div className="text-sm font-black text-emerald-700">{selectedBuilding.apartmentsPerFloor3br} Căn/Tầng</div>
                    <div className="text-xs text-emerald-500 font-bold">{selectedBuilding.area3brSqm} m²</div>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl flex justify-between items-center ${selectedBuilding.apartmentsGenerated ? 'bg-green-50 border border-green-100' : 'bg-orange-50 border border-orange-100'}`}>
                <div className="flex items-center gap-3">
                   {selectedBuilding.apartmentsGenerated ? <CheckCircle className="text-green-600"/> : <AlertCircle className="text-orange-600"/>}
                   <div>
                      <div className={`text-sm font-black ${selectedBuilding.apartmentsGenerated ? 'text-green-700' : 'text-orange-700'}`}>
                        {selectedBuilding.apartmentsGenerated ? 'ĐÃ SINH DỮ LIỆU' : 'CHỜ KHỞI TẠO'}
                      </div>
                      <div className="text-[10px] text-gray-500 font-bold">Quy mô: {selectedBuilding.numFloors} Tầng | {selectedBuilding.currentApartmentCount || 0} Căn hộ</div>
                   </div>
                </div>
                
                {!selectedBuilding.apartmentsGenerated && (
                  <button 
                    onClick={() => handleGenerate(selectedBuilding.id)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <RefreshCw size={14}/> SINH NGAY
                  </button>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50/50 flex gap-3">
              <button 
                onClick={() => navigate(`/buildings/edit/${selectedBuilding.id}`)}
                className="flex-1 bg-white border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <Edit size={16}/> Chỉnh sửa cấu hình
              </button>
              <button onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-gray-400 hover:text-gray-600">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}