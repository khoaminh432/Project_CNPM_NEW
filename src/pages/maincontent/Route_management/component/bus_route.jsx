function BusRoute({ route }) {
                const statusIcon = route.getStatusIcon();
                const statusText = route.getStatusText();
                const statusClass = `status status-${route.status}`;
  return (
    <tr>
        <td><strong>{route.id}</strong>
            {!route.hasVehicle ? <div class="no-vehicle"><i class="fas fa-exclamation-circle"></i> Chưa có xe phù hợp</div> : ''}
        
            </td>
        <td>
            <div>{route.name}</div>
        </td>
        <td>{route.startStation}</td>
        <td>{route.totalDistance}km </td>
        <td>Từ {route.timeStart.toString()} Đến {route.timeEnd.toString()}</td>
        <td><span class={statusClass}>{statusIcon} {statusText}</span></td>
        <td><button class="btn-detail" data-id={route.id}><i class="fas fa-eye"></i> Xem chi tiết</button></td>
    </tr>
  );
}




export default BusRoute;