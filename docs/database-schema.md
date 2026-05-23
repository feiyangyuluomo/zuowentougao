# docs/database-schema.md

# 数据库结构设计文档

本项目采用：

PostgreSQL + Prisma

系统核心采用：

「账号 → 身份 → 权益」

三层模型。

投稿系统采用：

「自主投稿 + 平台人工代投」

双路线模型。

---

# 一、数据库核心原则

1. user_id 是平台账号主体。
2. 微信和手机号只是登录凭证。
3. 一个账号允许多个身份。
4. 权益绑定 identity_id，而不是 user_id。
5. 自主投稿与平台代投必须分离。
6. AI改稿必须保存版本。
7. 投稿状态必须可追踪。
8. 所有状态变化必须保留日志。
9. 学生数据必须严格隔离。
10. 作文禁止用于AI训练。
11. 用户前台只展示必要状态，后台保留完整运营状态。
12. 所有敏感数据读取、修改、导出必须校验权限。

---

# 二、ER关系总览

```text
users
 ├── auth_identities
 ├── user_identities
 │      ├── identity_entitlements
 │      ├── memberships
 │      ├── organizations
 │      ├── classes
 │      ├── students
 │      │      ├── essays
 │      │      │      ├── essay_versions
 │      │      │      ├── ai_records
 │      │      │      ├── self_submissions
 │      │      │      └── agent_submission_tasks
 │      │      └── growth_records
 │
 ├── notifications
 ├── service_orders
 └── balance_accounts

publishers
 └── activities
        ├── self_submissions
        ├── agent_submission_tasks
        ├── seo_articles
        └── geo_pages

agent_submission_tasks
 ├── agent_submission_logs
 ├── agent_submission_screenshots
 └── service_orders

publication_detection_records
 ├── self_submissions
 └── agent_submission_tasks

marketing
 ├── coupons
 ├── coupon_records
 ├── after_sales
 ├── products
 └── packages
```

---

# 三、用户与身份系统

## 1. users 用户表

平台账号主体。

字段：

- id
- nickname
- avatar
- phone
- status
- register_source
- created_at
- updated_at

说明：

一个 user 可以拥有多个 identity。

---

## 2. auth_identities 登录凭证表

用于记录微信、手机号等登录方式。

字段：

- id
- user_id
- auth_type
- openid
- unionid
- phone
- status
- bound_at
- created_at
- updated_at

auth_type：

- wechat_mini_program
- wechat_web
- phone

说明：

微信、手机号都不是最终账号主体。  
真正主体是 users.id。

---

## 3. user_identities 身份表

字段：

- id
- user_id
- identity_type
- organization_id
- status
- created_at
- updated_at

identity_type：

- parent
- teacher
- organization_admin
- organization_teacher
- editor
- operator
- admin

说明：

所有权限、权益、数据范围都应该基于 identity_id 判断。

---

## 4. identity_entitlements 权益表

字段：

- id
- identity_id
- entitlement_type
- grade_scope
- ai_quota
- agent_submission_quota
- self_submission_limit
- expired_at
- created_at
- updated_at

entitlement_type：

- view_activity_detail
- view_submission_email
- ai_rewrite
- ai_recommend
- agent_submission
- organization_student_limit

说明：

权益归属 identity，而不是 user。

---

## 5. memberships 会员表

字段：

- id
- identity_id
- membership_type
- grade_scope
- valid_from
- valid_to
- is_lifetime
- status
- created_at
- updated_at

membership_type：

- yearly
- lifetime
- organization_primary
- organization_middle
- organization_all

---

# 四、机构与班级系统

## 1. organizations 机构表

字段：

- id
- name
- student_limit
- teacher_limit
- status
- valid_from
- expired_at
- created_at
- updated_at

---

## 2. classes 班级表

字段：

- id
- organization_id
- teacher_identity_id
- class_name
- grade
- created_at
- updated_at

---

## 3. students 学生表

字段：

- id
- owner_identity_id
- organization_id
- class_id
- student_name
- school
- grade
- gender
- created_at
- updated_at

说明：

学生必须绑定 owner_identity_id。  
家长、老师、机构看到的数据范围不同。

---

# 五、作文作品库

## 1. essays 作文表

字段：

- id
- student_id
- owner_identity_id
- title
- content
- word_count
- genre
- theme_tags
- status
- created_at
- updated_at

genre 示例：

- narrative
- argumentative
- prose
- poetry
- letter
- speech
- other

说明：

作文原文不能被AI覆盖。  
所有改稿都必须进入 essay_versions。

---

## 2. essay_versions 作文版本表

字段：

- id
- essay_id
- version_type
- content
- summary
- created_by_identity_id
- created_at

version_type：

- original
- ai_rewrite
- manual_edit
- final_submission
- agent_submission

说明：

AI改稿、人工批改、代投使用稿都必须形成版本记录。

---

# 六、AI系统

## 1. ai_records AI记录表

字段：

- id
- identity_id
- essay_id
- task_type
- model_name
- input_summary
- output_summary
- token_usage
- cost_amount
- created_at

task_type：

- rewrite
- recommend_activity
- title_suggestion
- column_match
- submission_advice

说明：

AI输出必须可追踪。  
不得把用户作文用于模型训练。

---

# 七、活动库系统

## 1. publishers 征稿方表

字段：

- id
- name
- description
- logo
- website
- publisher_type
- contact_info
- created_at
- updated_at

publisher_type：

- newspaper
- magazine
- official_account
- organization
- school
- other

---

## 2. activities 活动表

字段：

- id
- publisher_id
- title
- activity_type
- grade_scope
- genre
- theme_tags
- submission_email
- submission_method
- submission_format
- email_subject_format
- deadline
- is_long_term
- has_payment
- has_bonus
- has_certificate
- has_sample_issue
- support_self_submission
- support_agent_submission
- activity_status
- audit_status
- source_url
- original_detail
- public_summary
- paid_detail
- created_at
- updated_at

submission_method：

- email
- website
- mini_program
- wechat
- system
- offline
- other

activity_status：

- recruiting
- closing_soon
- closed
- long_term

audit_status：

- pending
- approved
- rejected

说明：

活动字段必须结构化。  
投稿邮箱、完整征稿详情、详细投稿方式属于付费可见内容。

---

# 八、自主投稿系统

## 1. self_submissions 自主投稿记录表

用于记录用户自己使用个人邮箱或其他方式完成的投稿。

字段：

- id
- essay_id
- activity_id
- identity_id
- student_id
- submission_email
- submission_method
- user_submission_time
- user_note
- submission_status
- result_status
- risk_confirmed
- risk_confirmed_at
- created_at
- updated_at

submission_status：

- pending
- user_submitted
- waiting_reply
- shortlisted
- planned_publish
- suspected_published
- published
- rejected
- closed

说明：

自主投稿是主流程。  
用户可手动维护部分状态。  
系统后期可通过OCR/AI辅助识别发表结果。

---

# 九、平台人工代投系统

## 1. agent_submission_tasks 平台代投任务表

用于记录用户付费后由平台运营人工投递的任务。

字段：

- id
- essay_id
- activity_id
- identity_id
- student_id
- order_id
- operator_identity_id
- platform_submission_email
- frontend_status
- backend_status
- priority_level
- submission_time
- failure_reason
- operator_note
- user_visible_note
- risk_confirmed
- risk_confirmed_at
- created_at
- updated_at

frontend_status：

- pending
- accepted
- preparing
- submitted
- waiting_reply
- shortlisted
- planned_publish
- suspected_published
- published
- rejected
- closed

backend_status：

- waiting_assign
- assigned
- reviewing_essay
- selecting_activity
- preparing_submission
- submitting
- submit_failed
- submitted
- waiting_reply
- need_more_info
- suspected_duplicate
- suspected_multi_submission
- shortlisted
- planned_publish
- suspected_published
- published
- rejected
- closed

说明：

用户前台看到 frontend_status。  
运营后台处理 backend_status。  
不要把复杂运营状态全部暴露给用户。

---

## 2. agent_submission_logs 代投状态日志表

字段：

- id
- task_id
- operator_identity_id
- old_frontend_status
- new_frontend_status
- old_backend_status
- new_backend_status
- note
- created_at

说明：

所有平台代投状态变化必须留痕。

---

## 3. agent_submission_screenshots 投稿截图表

字段：

- id
- task_id
- screenshot_type
- file_url
- visible_to_user
- uploaded_by_identity_id
- created_at

screenshot_type：

- email_sent
- submit_success
- submit_failed
- publisher_reply
- other

说明：

平台代投完成后，运营需要上传投稿截图或邮件截图。  
用户前台可查看 visible_to_user = true 的截图。

---

# 十、成长档案系统

## 1. growth_records 成长记录表

字段：

- id
- student_id
- record_type
- related_self_submission_id
- related_agent_submission_task_id
- title
- description
- evidence_url
- created_at

record_type：

- essay
- submission
- publication
- award
- certificate

说明：

成长档案可由自主投稿、平台代投、发表识别等数据生成。

---

# 十一、投稿结果智能识别系统

## 1. publication_detection_records 发表识别表

字段：

- id
- detected_title
- detected_author
- detected_school
- content_excerpt
- matched_self_submission_id
- matched_agent_submission_task_id
- match_score
- detect_source
- detect_status
- source_file_url
- created_at

detect_source：

- pdf
- image
- official_account_article
- user_upload
- operator_upload

detect_status：

- pending
- suspected_match
- confirmed
- rejected

说明：

可以匹配自主投稿，也可以匹配平台代投任务。

---

# 十二、订单与营销系统

## 1. service_orders 订单表

字段：

- id
- identity_id
- order_type
- amount
- payment_status
- related_essay_id
- related_activity_id
- related_agent_submission_task_id
- created_at
- paid_at

order_type：

- membership
- ai_rewrite
- ai_recommend
- agent_submission
- manual_review
- organization_package
- balance_recharge

payment_status：

- pending
- paid
- refunded
- partially_refunded
- closed

---

## 2. products 产品表

字段：

- id
- product_type
- name
- price
- description
- status
- created_at

product_type：

- membership
- ai_service
- agent_submission
- manual_review
- organization_package

---

## 3. coupons 优惠券表

字段：

- id
- coupon_type
- amount
- discount_rate
- valid_from
- valid_to
- status

---

## 4. coupon_records 优惠券领取记录表

字段：

- id
- coupon_id
- identity_id
- used_order_id
- status
- created_at
- used_at

---

## 5. after_sales 售后表

字段：

- id
- order_id
- after_sale_type
- refund_amount
- status
- reason
- operator_note
- created_at
- updated_at

after_sale_type：

- full_refund
- partial_refund
- balance_transfer
- service_exchange
- manual_process

---

## 6. balance_accounts 余额账户表

字段：

- id
- user_id
- balance
- updated_at

---

# 十三、消息系统

## 1. notifications 消息表

字段：

- id
- identity_id
- notification_type
- title
- content
- related_resource_type
- related_resource_id
- is_read
- created_at

notification_type：

- activity_deadline
- self_submission_reminder
- agent_submission_update
- screenshot_uploaded
- suspected_published
- membership_renew
- system_notice

---

# 十四、SEO/GEO系统

## 1. seo_articles SEO文章表

字段：

- id
- title
- slug
- keyword
- content
- status
- published_at
- created_at
- updated_at

---

## 2. geo_pages GEO页面表

字段：

- id
- page_type
- target_query
- ai_summary
- faq
- related_activity_ids
- status
- created_at
- updated_at

page_type：

- grade_recommendation
- theme_recommendation
- condition_aggregation
- faq
- comparison
- guide
```