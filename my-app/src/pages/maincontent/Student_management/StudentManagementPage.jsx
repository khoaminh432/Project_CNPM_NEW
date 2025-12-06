
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


  }

export default StudentManagementPage;