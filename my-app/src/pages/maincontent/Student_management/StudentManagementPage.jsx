<<<<<<< HEAD
import TempStudent from "./component/Student";
import Style from "./../styleMain.module.css";
import React, { useRef,useEffect, useState, useMemo } from "react";
import "./style.css";
import "./../searchbar.css";
import { Student } from "../../../models/Student";
import Detail_Student from "./component/formdetails/Detail_Student";
function renderStudentsTable(students, onDetails) {
  return(students.length > 0 ? (
          students.map((student) => (
            <TempStudent 
              key={student.id}
              Tempstudent={student}
              onDetails={onDetails}
            />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>Không tìm thấy học sinh phù hợp</p>
          </div>
        ));
}
function StudentManagementPage() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all'); // filter by route
  const [searchQuery, setSearchQuery] = useState(''); // search by name
  const [pagestudent, setPageStudent] = useState({}); // page state: default, detail
  const boxRef = useRef(null);
  const hide = () => {
    boxRef.current.style.display = "none";
  };

  const showgrid = () => {
    boxRef.current.style.display = "grid";
  };
  const showdetail = () => {
    boxRef.current.style.display = "flex";
  }
  useEffect(() => {
    // ví dụ: lấy từ API hoặc dữ liệu tĩnh
    
    setStudents([
      new Student({ id: "001", name: "Nguyễn Văn A", route: "Tuyến 1", address: "123 Đường A, Quận B", time: "07:30 AM", avatarUrl: null }),
      new Student({ id: "002", name: "Trần Thị B", route: "Tuyến 2", address: "456 Đường C, Quận D", time: "07:45 AM", avatarUrl: null }),
      new Student({ id: "003", name: "Lê Văn C", route: "Tuyến 1", address: "789 Đường E, Quận F", time: "08:00 AM", avatarUrl: null }),
      new Student({ id: "004", name: "Phạm Thị D", route: "Tuyến 3", address: "321 Đường G, Quận H", time: "08:15 AM", avatarUrl: null }),
      new Student({ id: "005", name: "Hoàng Văn E", route: "Tuyến 2", address: "654 Đường I, Quận J", time: "08:30 AM", avatarUrl: null }),
      new Student({ id: "006", name: "Vũ Thị F", route: "Tuyến 3", address: "987 Đường K, Quận L", time: "08:45 AM", avatarUrl: null }),
      new Student({ id: "007", name: "Đặng Văn G", route: "Tuyến 1", address: "147 Đường M, Quận N", time: "09:00 AM", avatarUrl: null }),
      new Student({ id: "008", name: "Bùi Thị H", route: "Tuyến 2", address: "258 Đường O, Quận P", time: "09:15 AM", avatarUrl: null }),
      new Student({ id: "009", name: "Ngô Văn I", route: "Tuyến 3", address: "369 Đường Q, Quận R", time: "09:30 AM", avatarUrl: null }),
      new Student({ id: "010", name: "Trịnh Thị K", route: "Tuyến 1", address: "159 Đường S, Quận T", time: "09:45 AM", avatarUrl: null }),
      new Student({ id: "011", name: "Lý Văn L", route: "Tuyến 2", address: "753 Đường U, Quận V", time: "10:00 AM", avatarUrl: null }),
    ]);
    setPageStudent({key: "default", value: null});
  }, []);

  // filter + search logic
  const filteredStudents = useMemo(() => {
    let result = students;

    // filter by route
    if (filter !== 'all') {
      result = result.filter(s => s.route === filter);
    }

    // search by name or id
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.id.includes(q)
      );
    }

    return result;
  }, [students, filter, searchQuery]);
  function handleSwitchPage(){
    switch(pagestudent.key){
      case "detail":
        return <Detail_Student tempStudent={pagestudent.value} backToList={goBackToList}/>;
      default:
        
        return renderStudentsTable(filteredStudents, handleStudentDetails);
    }
  }
  // helper functions

  const handleAddStudent = () => {
    showdetail()
    
  };

  const handleStudentDetails = (student) => {
    showdetail()
    setPageStudent({key: "detail", value: student});
    console.log('View details for student', pagestudent);
  };
  const goBackToList = () => {
    showgrid()
    setPageStudent({key: "default", value: null});
  }
  return (
    <div className={Style.content_main_center + " " + Style.column_direction}>
      {/* Header */}
      <header style={{width:"100%"}}>
        <div className={Style.row_direction} style={{justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className={Style.setTitle_h1}><i className="fas fa-users" /> Quản Lý Học Sinh</h1>
            <p className="description">Quản lý và theo dõi danh sách học sinh đi xe buýt</p>
          </div>
          <div>
            <button style={{ color: "white" }} onClick={handleAddStudent}>➕ Thêm Học Sinh</button>
          </div>
        </div>
      </header>

      {/* Dashboard cards */}
      

      {/* Search + Filter */}
      <div className={"row-container-searchbar " + Style.row_direction}>
        <div className="search-container">
          <i className="fas fa-search" />
          <input 
            style={{ fontSize: "1.1em" }} 
            type="text" 
            className="search-box" 
            placeholder="Tìm kiếm học sinh (tên hoặc mã)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <i className="fas fa-filter" />
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả tuyến xe</option>
            <option value="Tuyến 1">Tuyến 1</option>
            <option value="Tuyến 2">Tuyến 2</option>
            <option value="Tuyến 3">Tuyến 3</option>
            <option value="Tuyến 4">Tuyến 4</option>
          </select>
        </div>
      </div>

      {/* Card Grid - renders filtered students dynamically */}
      <div className="card-grid" ref={boxRef}>
        {handleSwitchPage()}
      </div>
    </div>
  );
=======
import Student from "./component/Student";
import Style from "./../styleMain.module.css";
import "./style.css";
function StudentManagementPage() {

    return(
        <div className={Style.content_main_center 
        + " " + Style.column_direction} style={{border:"red solid 3px",padding:"20px",boxSizing:"border-box"}}>
        <div className={Style.row_direction} style={{justifyContent:"space-between",width:"100%"}}>
            <h2>
        Lọc theo Tuyến xe</h2>
        <div className="header-actions" style={{fontSize:"1em"}}>
          <button >📝 Chỉnh sửa</button>
          <button>➕ Thêm học sinh</button>
        </div>
        </div>
        
      

      <div className="card-grid" style={{border:"blue solid 3px",width:"auto",height:"auto",padding:"10px"}}>
        <div className={Style.row_direction} style={{height:"auto",width:"100%"}}>
            

            
        </div>
      </div>
        </div>
    )

>>>>>>> ADMINTC
}

export default StudentManagementPage;