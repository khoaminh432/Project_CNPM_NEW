import Student from "./component/Student";
import Style from "./../styleMain.module.css";
import "./style.css";
function StudentManagementPage() {

    return(
        <div className={Style.content_main_center 
        + " " + Style.column_direction} style={{border:"red solid 3px",padding:"20px",boxSizing:"border-box"}}>
        <div className={Style.row_direction+" "+" header-row"} style={{justifyContent:"space-between",width:"100%"}}>
            <div>
              <h2>Lọc theo Tuyến xe</h2>
              <div className="toolbar">
                <select className="select">
                  <option value="">Tất cả tuyến</option>
                  <option value="1">Tuyến 1</option>
                  <option value="2">Tuyến 2</option>
                </select>
                <input className="search" placeholder="Tìm học sinh, địa chỉ..." />
              </div>
            </div>

            <div className="header-actions" style={{fontSize:"1em"}}>
              <button>➕ Thêm học sinh</button>
            </div>
        </div>
        
      

      <div className="card-grid" style={{border:"#aaa solid 3px",height:"100%",width:"100%",padding:"10px"}}>
        <Student/>
      </div>
        </div>
    )

}

export default StudentManagementPage;