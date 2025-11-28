class Stop {
    constructor(stopId, routeId, stopCode, stopName, address, latitude, longitude, stopOrder, arrivalTime, studentCount, stopType, createdAt, updatedAt) {
        this.stopId = stopId;
        this.routeId = routeId;
        this.stopCode = stopCode;
        this.stopName = stopName;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.stopOrder = stopOrder;
        this.arrivalTime = arrivalTime;
        this.studentCount = studentCount;
        this.stopType = stopType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    createStop() {
        // Logic to create a new stop
    }

    updateStop() {
        // Logic to update stop information
    }

    deleteStop() {
        // Logic to delete a stop
    }
}

export default Stop;