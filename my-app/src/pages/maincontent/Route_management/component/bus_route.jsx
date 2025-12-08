
function BusRoute({ route, onViewDetail=()=>{} }) {
    function getStatusIcon() {
    const iconMap = {
        'stable': <i class="fas fa-check-circle"></i>,
        'warning': <i class="fas fa-exclamation-triangle"></i>,
        'danger': <i class="fas fa-times-circle"></i>,
        'active': <i class="fas fa-check-circle"></i>,
        'inactive': <i class="fas fa-times-circle"></i>,
        'Đang hoạt động': <i class="fas fa-check-circle"></i>,
        'Ngưng hoạt động': <i class="fas fa-times-circle"></i>
    };
    return iconMap[route.status] || <i class="fas fa-question-circle"></i>;
    }
    function getStatusText() {
    const statusMap = {
        'stable': 'Ổn định',
        'warning': 'Có vấn đề',
        'danger': 'Nguy hiểm',
        "Đang hoạt động": 'Đang hoạt động',
        "Ngưng hoạt động": 'Ngưng hoạt động',
        "active":'Đang hoạt động',
        "inactive":"Ngưng hoạt động"
    };
    return statusMap[route.status] || 'Không xác định';  }
    const statusIcon = getStatusIcon();
    const statusText = getStatusText();
    const statusClass = route.status==="Đang hoạt động" ? `status status-${"stable"}`: `status status-${"danger"}`;
  return (
    <tr>
        <td><strong>{route.route_code}</strong>
            </td>
        <td>
            <div>{route.route_name}</div>
        </td>
        <td>{route.start_location}</td>
        <td>{}km </td>
        <td>{route.total_students}</td>
        <td>Từ {route.planned_start} Đến {route.planned_end}</td>
        <td><span class={statusClass}>{statusIcon} {statusText}</span></td>
        <td><button class="btn-detail" data-id={route.route_code} onClick={()=>onViewDetail(route)} ><i class="fas fa-eye"></i> Xem chi tiết</button></td>
    </tr>
  );
}




export default BusRoute;