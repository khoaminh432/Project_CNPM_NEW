// model class for student
export class Student {
  constructor(data = {}) {
    this.id = data.id ?? '001';
    this.name = data.name ?? 'Nguyễn Văn A';
    this.gender = data.gender ?? 'Nam';
    this.dob = data.dob ?? '15/05/2010';
    this.placeOfBirth = data.placeOfBirth ?? 'TP. Hồ Chí Minh';
    this.address = data.address ?? '455 Hồng Bàng, Phường 14, Quận 5, TP. HCM';
    this.phone = data.phone ?? '0901 234 567';
    this.email = data.email ?? 'nguyenvana@example.com';
    this.className = data.className ?? '6A1';
    this.schoolYear = data.schoolYear ?? '2023-2024';
    this.route = data.route ?? '1';
    this.pickupTime = data.pickupTime ?? '6:55';
    this.parentName = data.parentName ?? 'Nguyễn Văn B';
    this.relation = data.relation ?? 'Cha';
    this.parentPhone = data.parentPhone ?? '0909 876 543';
    this.parentEmail = data.parentEmail ?? 'nguyenvanb@example.com';
    this.avatarUrl = data.avatarUrl ?? null;
  }
  
  // merge updates immutably
  with(update = {}) {
    return new Student({ ...this, ...update });
  }

  // setter methods - return new instance (immutable pattern)
  setId(id) { return this.with({ id }); }
  setName(name) { return this.with({ name }); }
  setGender(gender) { return this.with({ gender }); }
  setDob(dob) { return this.with({ dob }); }
  setPlaceOfBirth(placeOfBirth) { return this.with({ placeOfBirth }); }
  setAddress(address) { return this.with({ address }); }
  setPhone(phone) { return this.with({ phone }); }
  setEmail(email) { return this.with({ email }); }
  setClassName(className) { return this.with({ className }); }
  setSchoolYear(schoolYear) { return this.with({ schoolYear }); }
  setRoute(route) { return this.with({ route }); }
  setPickupTime(pickupTime) { return this.with({ pickupTime }); }
  setParentName(parentName) { return this.with({ parentName }); }
  setRelation(relation) { return this.with({ relation }); }
  setParentPhone(parentPhone) { return this.with({ parentPhone }); }
  setParentEmail(parentEmail) { return this.with({ parentEmail }); }
  setAvatarUrl(avatarUrl) { return this.with({ avatarUrl }); }

  // bulk update
  update(updates = {}) {
    return this.with(updates);
  }
}