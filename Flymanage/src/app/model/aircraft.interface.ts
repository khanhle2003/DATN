export interface AircraftDTO {
    id?: number; // Thêm ? để id là tùy chọn khi tạo mới
    aircraftCode: string; // Mã máy bay
    aircraftType: string; // Loại máy bay
    economySeats: number; // Số ghế thường
    businessSeats: number; // Số ghế thương gia
    airlineId?: number; // ID hãng bay (nếu cần)
    airlineName?: string; // Tên hãng bay
}