# Background Jobs Requirements Questionnaire

> **Purpose**: Thu thập requirements để lựa chọn giữa Laravel Queue vs Laravel Horizon
> **Date Created**: 2026-01-11
> **Status**: ⏳ Pending Review

---

## 1. Job Volume & Frequency (Khối lượng và tần suất)

### 1.1 Current Expected Volume

| Metric | Value | Notes |
|--------|-------|-------|
| **Jobs per hour** (trung bình) | ~30-50 | Trung bình: Task notifications, comment notifications, status updates |
| **Jobs per hour** (peak time) | ~150-200 | Peak 8-10am (task assignment) và 4-6pm (task completion rush) |
| **Jobs per day** | ~600-800 | Bao gồm: notifications, reports, email, scheduled tasks |
| **Concurrent jobs** | ~10-15 | Tối đa 15 jobs chạy đồng thời (peak time notifications burst) |

**Breakdown by activity:**
- Task creation notifications: ~50-100/day (HQ tạo task cho stores)
- Task confirm notifications: ~200-300/day (Store staff confirm tasks)
- Comment notifications: ~100-150/day (Trao đổi về tasks)
- Status update notifications: ~150-200/day (Real-time task status changes)
- Daily reports: ~1-2/day (Tổng hợp hàng ngày)
- Email notifications: ~100-200/day

### 1.2 Growth Projection

| Timeframe | Expected Volume | Notes |
|-----------|----------------|-------|
| **6 months** | ~80 jobs/hour | +60% growth: More stores onboarding, more tasks |
| **1 year** | ~120 jobs/hour | +140% growth: 50 stores, 500 staff |
| **2 years** | ~200 jobs/hour | +300% growth: 80 stores, 800 staff, more modules active |

### 1.3 Job Pattern

Chọn pattern phù hợp nhất:

- [x] **Continuous**: Jobs chạy liên tục suốt ngày
- [x] **Peak Hours**: Jobs tập trung vào giờ nhất định (ví dụ: 8-10am, 5-7pm)
- [ ] **Scheduled**: Jobs chạy theo lịch định kỳ (hourly, daily, weekly)
- [x] **Event-driven**: Jobs trigger khi có event (user action, webhook, etc.)

**Mô tả chi tiết pattern**:
```
Pattern: HYBRID (Continuous + Peak Hours + Event-driven)

1. EVENT-DRIVEN (Chủ yếu - 70% jobs):
   - Task created → Notification job (assign to store staff)
   - Task confirmed → Notification job (notify HQ/manager)
   - Comment added → Notification job (notify relevant users)
   - Status changed → Real-time notification (via WebSocket + background job)

2. PEAK HOURS (20% jobs):
   - 8:00-10:00 AM: HQ tạo tasks mới cho stores → Burst notifications
   - 12:00-1:00 PM: Lunch break, staff check và confirm tasks
   - 4:00-6:00 PM: End of day, staff complete tasks → Report generation

3. CONTINUOUS (10% jobs):
   - Background: Task reminder jobs (overdue tasks)
   - Scheduled: Daily reports (6:00 PM mỗi ngày)
   - Cleanup: Cache cleanup, log rotation

Đặc điểm:
- Jobs trigger REAL-TIME khi có user action (comment, status change)
- Peak time có thể lên đến 200 jobs/hour
- Off-peak vẫn có ~10-20 jobs/hour (reminders, background sync)
```

---

## 2. Job Types (Các loại công việc)

Đánh dấu các loại jobs sẽ có trong hệ thống:

### 2.1 Email & Notifications

| Job Type | Frequency | Priority | Notes |
|----------|-----------|----------|-------|
| **Welcome Email** | ⬜ High [x] Medium ⬜ Low | ⬜ Urgent [x] Normal ⬜ Low | ~1-2 emails/day (new staff onboarding) |
| **Password Reset Email** | [x] High ⬜ Medium ⬜ Low | [x] Urgent ⬜ Normal ⬜ Low | ~5-10 emails/day (urgent, user đang đợi) |
| **Task Assignment Notification** | [x] High ⬜ Medium ⬜ Low | [x] Urgent ⬜ Normal ⬜ Low | ~50-100 notifications/day (HIGH PRIORITY - task mới) |
| **Task Status Change Notification** | [x] High ⬜ Medium ⬜ Low | [x] Urgent ⬜ Normal ⬜ Low | ~150-200 notifications/day (confirm, complete, etc.) |
| **Comment/Message Notification** | [x] High ⬜ Medium ⬜ Low | [x] Urgent ⬜ Normal ⬜ Low | ~100-150 notifications/day (real-time chat) |
| **Daily Report Email** | ⬜ High [x] Medium ⬜ Low | ⬜ Urgent [x] Normal ⬜ Low | ~2 emails/day (HQ managers) |
| **Overdue Task Reminder** | ⬜ High [x] Medium ⬜ Low | ⬜ Urgent [x] Normal ⬜ Low | ~20-30 reminders/day |

**Estimated email/notification volume**: ~450-600 notifications/day

**Breakdown:**
- In-app notifications (real-time): ~400-500/day (WebSocket + background job)
- Email notifications: ~100-200/day (critical updates only)
- Push notifications (future): TBD

### 2.2 Report Generation

| Report Type | Frequency | File Size | Processing Time | Priority |
|-------------|-----------|-----------|-----------------|----------|
| **Daily Task Report** | ⬜ Daily ⬜ Weekly ⬜ On-demand | _________ MB | _________ seconds | ⬜ High ⬜ Low |
| **Monthly Performance Report** | ⬜ Monthly ⬜ On-demand | _________ MB | _________ seconds | ⬜ High ⬜ Low |
| **Excel Export** | ⬜ On-demand | _________ MB | _________ seconds | ⬜ High ⬜ Low |
| **PDF Generation** | ⬜ On-demand | _________ MB | _________ seconds | ⬜ High ⬜ Low |

**Estimated report generation**: _________ reports/day

### 2.3 File Processing

| Task | Frequency | File Size | Processing Time | Priority |
|------|-----------|-----------|-----------------|----------|
| **Image Upload Processing** | ⬜ High ⬜ Medium ⬜ Low | _________ MB | _________ seconds | ⬜ Urgent ⬜ Normal |
| **Document Upload Processing** | ⬜ High ⬜ Medium ⬜ Low | _________ MB | _________ seconds | ⬜ Urgent ⬜ Normal |
| **Video Processing** | ⬜ High ⬜ Medium ⬜ Low | _________ MB | _________ seconds | ⬜ Urgent ⬜ Normal |

**Estimated file uploads**: _________ files/day

### 2.4 Data Synchronization

| Sync Task | Frequency | Data Volume | Priority |
|-----------|-----------|-------------|----------|
| **Task Status Sync** | ⬜ Real-time ⬜ Every 5min ⬜ Hourly | _________ records | ⬜ High ⬜ Low |
| **User Data Sync** | ⬜ Real-time ⬜ Hourly ⬜ Daily | _________ records | ⬜ High ⬜ Low |
| **Store Data Sync** | ⬜ Real-time ⬜ Hourly ⬜ Daily | _________ records | ⬜ High ⬜ Low |

**Estimated sync operations**: _________ syncs/day

### 2.5 Scheduled Tasks (Cron Jobs)

| Task | Schedule | Estimated Duration | Critical? |
|------|----------|-------------------|-----------|
| **Daily Task Reminder** | ⬜ Daily at _______ | _________ minutes | ⬜ Yes ⬜ No |
| **Weekly Report Generation** | ⬜ Weekly on _______ | _________ minutes | ⬜ Yes ⬜ No |
| **Database Cleanup** | ⬜ Daily ⬜ Weekly | _________ minutes | ⬜ Yes ⬜ No |
| **Cache Cleanup** | ⬜ Hourly ⬜ Daily | _________ minutes | ⬜ Yes ⬜ No |

### 2.6 Other Background Jobs

Liệt kê các jobs khác chưa được đề cập:

```
1. [Job Name]: [Mô tả] - Frequency: _____ - Priority: _____
2. [Job Name]: [Mô tả] - Frequency: _____ - Priority: _____
3. [Job Name]: [Mô tả] - Frequency: _____ - Priority: _____
```

---

## 3. Priority & SLA Requirements (Ưu tiên và yêu cầu thời gian)

### 3.1 Job Priority Levels

Phân loại jobs theo priority:

**Critical (Urgent - phải xử lý ngay)**:
```
- [Job 1]: _______ (ví dụ: Password Reset Email)
- [Job 2]: _______
- [Job 3]: _______
```

**High Priority (phải xử lý trong vài phút)**:
```
- [Job 1]: _______
- [Job 2]: _______
```

**Normal Priority (có thể đợi 10-30 phút)**:
```
- [Job 1]: _______
- [Job 2]: _______
```

**Low Priority (có thể đợi vài giờ)**:
```
- [Job 1]: _______ (ví dụ: Daily Report Generation)
- [Job 2]: _______
```

### 3.2 SLA (Service Level Agreement)

| Job Type | Max Acceptable Delay | Retry Strategy |
|----------|---------------------|----------------|
| **Email notifications** | _________ seconds | ⬜ Retry 3 times ⬜ Retry 5 times ⬜ Manual retry |
| **Report generation** | _________ minutes | ⬜ Retry 3 times ⬜ Retry 5 times ⬜ Manual retry |
| **File processing** | _________ minutes | ⬜ Retry 3 times ⬜ Retry 5 times ⬜ Manual retry |
| **Data sync** | _________ seconds | ⬜ Retry 3 times ⬜ Retry 5 times ⬜ Manual retry |

### 3.3 Failed Job Handling

Khi job fail, hệ thống nên:

- [ ] **Auto retry** với exponential backoff (retry sau 1s, 2s, 4s, 8s...)
- [ ] **Alert admin** qua email/notification
- [ ] **Log to monitoring system**
- [ ] **Move to dead-letter queue** for manual review
- [ ] **Rollback changes** nếu có

**Maximum retries before giving up**: _________ times

---

## 4. Monitoring & Observability (Giám sát)

### 4.1 Monitoring Requirements

Đánh giá mức độ quan trọng của các monitoring features:

| Feature | ⬜ Critical | ⬜ Nice-to-have | ⬜ Not needed |
|---------|------------|----------------|---------------|
| **Real-time dashboard** | | | |
| **Job success/failure rate** | | | |
| **Job throughput (jobs/hour)** | | | |
| **Average processing time** | | | |
| **Queue size monitoring** | | | |
| **Failed job list** | | | |
| **Retry failed jobs manually** | | | |
| **Job history/logs** | | | |
| **Performance metrics** | | | |
| **Alert when queue too long** | | | |

### 4.2 Dashboard Access

Ai cần access monitoring dashboard?

- [ ] System Admin
- [ ] Dev Team
- [ ] QA Team
- [ ] Product Owner
- [ ] Customer Support

### 4.3 Alerting

Khi nào cần alert?

- [ ] Queue size > _________ jobs
- [ ] Failed jobs > _________ %
- [ ] Processing time > _________ seconds
- [ ] No jobs processed for > _________ minutes

**Alert channels**:
- [ ] Email
- [ ] Slack
- [ ] SMS
- [ ] Dashboard notification

---

## 5. Infrastructure & Resources (Hạ tầng)

### 5.1 Server Resources

**Production Server Specs**:
- CPU: _________ cores
- RAM: _________ GB
- Disk: _________ GB

**Can allocate for queue workers**:
- CPU: _________ cores (số cores có thể dành cho workers)
- RAM: _________ GB (RAM có thể dành cho workers)

### 5.2 Worker Configuration

**Number of workers** có thể chạy đồng thời: _________

**Queue worker memory limit**: _________ MB per worker

**Queue worker timeout**: _________ seconds (max time for 1 job)

### 5.3 Redis/Database

**Redis available?**
- [ ] Yes - Redis already set up
- [ ] No - Need to install Redis
- [ ] Can use database instead

**Database for queue**:
- [ ] MySQL
- [ ] PostgreSQL
- [ ] Redis

---

## 6. User Impact Analysis

### 6.1 User-facing Jobs

Những jobs nào user đang đợi kết quả?

| Job | User waiting? | Max acceptable wait time |
|-----|--------------|-------------------------|
| **Report export** | ⬜ Yes ⬜ No | _________ seconds |
| **File upload processing** | ⬜ Yes ⬜ No | _________ seconds |
| **Email sending** | ⬜ Yes ⬜ No | _________ seconds |

### 6.2 User Experience Requirements

Khi user trigger một job (ví dụ: export Excel):

- [ ] **Synchronous**: User đợi cho đến khi job hoàn thành (không dùng queue)
- [ ] **Async with progress**: User thấy progress bar, có thể làm việc khác
- [ ] **Async with notification**: User tiếp tục làm việc, nhận notification khi xong
- [ ] **Email result**: User nhận link download qua email

---

## 7. Business Context

### 7.1 Number of Users

**Current active users**: _________ users

**Expected growth**:
- 6 months: _________ users
- 1 year: _________ users
- 2 years: _________ users

### 7.2 Business Hours

**Peak business hours**: từ _______ đến _______

**Off-peak hours**: từ _______ đến _______

**24/7 operation?**: ⬜ Yes ⬜ No

### 7.3 Compliance & Audit

**Need job audit trail?**
- [ ] Yes - Must log all jobs for compliance
- [ ] No - Basic logging is enough

**Data retention for job logs**: _________ days

---

## 8. Budget & Maintenance

### 8.1 Budget Consideration

**Monthly budget for queue infrastructure**: $_________ USD

**Can afford dedicated Redis server?**: ⬜ Yes ⬜ No

**Can afford more server resources?**: ⬜ Yes ⬜ No

### 8.2 Maintenance

**Dev team size**: _________ developers

**DevOps support available?**: ⬜ Yes ⬜ No

**Preferred maintenance complexity**:
- [ ] Simple - ít config, ít monitoring
- [ ] Advanced - nhiều config, monitoring chi tiết

---

## 9. Summary & Recommendation Request

### 9.1 Key Requirements Summary

**Điền tóm tắt 3-5 requirements quan trọng nhất**:

1. _________________________________________
2. _________________________________________
3. _________________________________________
4. _________________________________________
5. _________________________________________

### 9.2 Concerns & Questions

Những lo ngại hoặc câu hỏi bạn muốn dev team clarify:

```
1. _________________________________________
2. _________________________________________
3. _________________________________________
```

---

## 10. Decision Matrix (Dev Team to Fill)

> **Note**: Section này sẽ được dev team điền sau khi review requirements

### Laravel Queue vs Laravel Horizon Comparison

| Criteria | Laravel Queue | Laravel Horizon | Recommendation |
|----------|---------------|-----------------|----------------|
| **Setup Complexity** | Simple | Moderate | |
| **Monitoring** | Basic logs | Real-time dashboard | |
| **Resource Usage** | Low | Medium-High | |
| **Scalability** | Good | Excellent | |
| **Cost** | Low | Medium | |
| **Suitable for volume** | < 100 jobs/hour | > 100 jobs/hour | |
| **Our Project Fit** | | | |

### Final Recommendation

**Dev Team Recommendation**: ⬜ Laravel Queue | ⬜ Laravel Horizon

**Reasoning**:
```
[Dev team to fill after reviewing requirements]
```

**Implementation Notes**:
```
[Dev team to fill - any special configurations needed]
```

---

## 11. Next Steps

- [ ] Product Owner fills sections 1-9
- [ ] Dev team reviews requirements
- [ ] Dev team fills section 10 (Decision Matrix)
- [ ] Schedule meeting to discuss recommendation
- [ ] Update CLAUDE.md with final decision

---

## Changelog

| Date | Changes |
|------|---------|
| 2026-01-11 | Initial questionnaire created to gather background jobs requirements |
