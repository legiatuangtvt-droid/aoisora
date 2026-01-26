## # TÀI LIỆU PHÂN TÍCH YÊU CẦU HỆ THỐNG QUẢN LÝ TASK (AEON)



(Những nội dung bên dưới chỉ là sample, nhờ anh chị đổi lại thành nội dung đúng ạ)

### # 1. Mục tiêu dự án

Hệ thống được thiết kế để chuẩn hóa và tối ưu hóa việc quản lý task, điều phối nhân lực (DWS - Digital Work Schedule) và giao việc từ trụ sở chính (HQ) xuống các cửa hàng thuộc hệ thống AEON.

- **Mục tiêu:** Thay đổi phương thức quản lý thủ công sang kỹ thuật số, đảm bảo task được giao đúng bộ phận, đúng thời điểm và theo dõi được tiến độ/hiệu suất (Man-hour).
- **Phạm vi:** Áp dụng cho 6 phòng ban chính (OP, Admin, Control, Improvement, Planning, HR) và các cấp bậc từ HQ đến nhân viên cửa hàng.

## # Định nghĩa thuật ngữ

(hãy list hết các thuật ngữ được sử dụng trong hệ thống, và giải thích, data có sẵn chỉ là sample)

| No   | Thuật ngữ | Phân loại | Giải thích            | Hoạt động                                       |
| ---- | -------------------- | -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
|      | Departments  |                |            |           |
|      | OP           | Departments    |            |           |
|      | Perishable   | Departments OP |            |           |
|      | Grocery      |                |            |           |
|      | Delica       |                |            |           |
|      | D&D          |                |            |           |
|      | CS           |                |            |           |
|      | Admin        |                |            |           |
|      | Admin        |                |            |           |
|      | MMD          |                |            |           |
|      | ACC          |                |            |           |
|      | Control      |                |            |           |
|      | Improvement  |                |            |           |
|      | Planning     |                |            |           |
|      | MKT          |                |            |           |
|      | SPA          |                |            |           |
|      | ORD          |                |            |           |
|      | HQ           |                |            |           |
|      | Store        |                |            |           |
|      | Store Leader |                |            |                                                              |
|      | Staft        |                |            | |




## # Yêu cầu nghiệp vụ

### ## Flow hiện tại  (AS-IS)

| Scenario No | Nhân vật | Kịch bản                   | Lv1         | Lv2        | Lv3   | data               |
|--------| ------- |-------------------------------| ----------- | ---------- | ----- | ------------------- |
| 1 | HQ | HQ Staff gửi yêu cầu (Task) xuống Store qua Email/Zalo hoặc giấy tờ. Hằng ngày/Hằng tuần hoặc khi có chiến dịch (Promotion). |  |  |  |  |
| 2     | Store Leader | Store Leader ghi nhận task, tự phân bổ bằng bảng Excel hoặc bảng trắng tại cửa hàng. |  |                      |            |        |
|             |              |                                                              |      |      |      |      |
|             |              |                                                              |      |      |      |      |
|             |              |                                                              |      |      |      |      |
|             |              |                                                              |      |      |      |      |
|             |              |                                                              |      |      |      |      |
|             |              |                                                              |      |      |      |      |
|             |              |                                                              |      |      |      |      |
|             |              |                                                              |      |      |      |      |
|             |              |                                                              |      |      |      |      |



### ## Flow mong muốn (TO-BE)

### Level phân quyền

・1.Admin
・2.HQ
・3.Store leader
・4.Staff

| Scenario No | Level phân quyền | Nhân vật                                      | khái quát yêu cầu | Bổ sung |
|--------| ------------ |---------------------------------------------------| ------------------- | ---- |
| 1       | 2             | HQ      | Đăng nhập -> Chọn Department -> Tạo Task (Thêm ảnh/mô tả) -> Assign cho danh sách Store -> Theo dõi Dashboard tiến độ. |                                                              |
| 2         | 3         | Store Leader       | Nhận Notification -> Vào màn hình Store Task -> Assign task đó cho Staff cụ thể hoặc đưa vào lịch làm việc (Schedule). |  |
| 4         | 4    | Staff          | Dùng Mobile/Tablet xem "To-do task" -> Thực hiện -> Chụp ảnh/Báo cáo kết quả trực tiếp trên hệ thống. |                                |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |
|             |                  |              |                                                              |         |



## # Yêu cầu chức năng

### ## List screen

(đây mô tả là màn hình nào sử dụng trong kịch bản nào)

| Screen No | Screen name                 | Scenario | Khái quát màn hình |
| --------- | --------------------------- | -------- | ------------------ |
| 1         | Login (hãy gắn hình design) | 8        |                    |
|           |                             |          |                    |
|           |                             |          |                    |
|           |                             |          |                    |
|           |                             |          |                    |
|           |                             |          |                    |
|           |                             |          |                    |
|           |                             |          |                    |
|           |                             |          |                    |



## ## Work flow

(sơ đồ hoạt động của các màn hình, chức năng)

