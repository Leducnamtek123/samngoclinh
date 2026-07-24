import { ProfileContentIntroItem } from "./profile-content-info-intro-item"

export function ProfileContentIntroList({ user }: { user?: any }) {
  const userInfo = user || {}
  const location = userInfo.state
    ? userInfo.state + ", " + (userInfo.country || "Việt Nam")
    : userInfo.country || "Việt Nam"

  return (
    <ul className="grid gap-y-3">
      <ProfileContentIntroItem
        title="Chức vụ / Vai trò"
        value={
          <>
            {userInfo.role || "Quản trị viên"}{" "}
            <span className="text-foreground"> tại </span>{" "}
            {userInfo.organization || "Hệ thống Sâm Ngọc Linh"}
          </>
        }
        iconName="BriefcaseBusiness"
      />
      <ProfileContentIntroItem
        title="Khu vực"
        value={location}
        iconName="House"
      />

      <ProfileContentIntroItem
        title="Email liên hệ"
        value={userInfo.email || "admin@samngoclinh.com"}
        iconName="Mail"
      />

      <ProfileContentIntroItem
        title="Số điện thoại"
        value={userInfo.phoneNumber || "---"}
        iconName="Phone"
      />
      <ProfileContentIntroItem
        title="Ngôn ngữ"
        value={userInfo.language || "Tiếng Việt"}
        iconName="Languages"
      />
    </ul>
  )
}
