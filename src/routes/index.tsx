// routes/index.tsx
import DefaultLayout from "../layouts/DefaultLayout";
import AuthLayout from "../layouts/AuthLayout";

import { lazyLoad } from "../shared/utils/router.util";
import JobTicker from "../modules/candidate/Jobs";
import About from "../modules/candidate/About";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import NotFound from "../components/NotFound";
import CandidateDashboard from "../modules/candidate/CandidateDashboard";
import EditCandidateProfile from "../modules/candidate/EditCandidateProfile";
import JobSearch from "../modules/candidate/JobSearch";
import CandidateInbox from "../modules/candidate/CandidateInbox";
import AccountSettings from "../modules/candidate/AccountSettings";
import PendingApproval from "../modules/teams/PendingApproval";
import CandidateProfileView from '../modules/candidate/CandidateProfileView';
import TeamInbox from '../modules/teams/TeamInbox';
import Inbox from '../modules/inbox/Inbox';
import JobDetails from '../modules/candidate/JobDetails';
const TeamDashboard = lazyLoad(() => import("../modules/teams/TeamDashboard"));

const TeamRegister = lazyLoad(() => import("../modules/teams/TeamRegister"));
const CandidateRegister = lazyLoad(
  () => import("../modules/candidate/CandidateRegister")
);
const Login = lazyLoad(() => import("../modules/auth/Login"));
const Player = lazyLoad(() => import("../modules/candidate/Player"));
const EditTeamProfile = lazyLoad(() => import("../modules/teams/EditTeamProfile"));
const AdminLogin = lazyLoad(() => import("../modules/admin/AdminLogin"));
const AdminDashboard = lazyLoad(() => import("../modules/admin/AdminDashboard"));
const UserManagement = lazyLoad(() => import("../modules/admin/UserManagement"));
const CandidateImport = lazyLoad(() => import("../modules/admin/CandidateImport"));
const RevenueReports = lazyLoad(() => import("../modules/admin/RevenueReports"));
const TermsPrivacyManagement = lazyLoad(() => import("../modules/admin/TermsPrivacyManagement"));
const Register = lazyLoad(() => import("../modules/auth/Register"));


const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<JobTicker />} />
        <Route path="/about" element={<About />} />
        <Route path="/player" element={<Player />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<AuthLayout />} errorElement={<NotFound />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/profile/edit" element={<EditCandidateProfile />} />
        <Route path="/candidate/register" element={<CandidateRegister />} />
        <Route path="/team/register" element={<TeamRegister />} />
        <Route path="/team/pending" element={<PendingApproval />} />
        <Route path="/team/dashboard" element={<TeamDashboard />} />
        <Route path="/team/profile/edit" element={<EditTeamProfile />} />
        <Route path="/team/candidate/:id" element={<CandidateProfileView />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/import" element={<CandidateImport />} />
        <Route path="/admin/revenue" element={<RevenueReports />} />
        <Route path="/admin/terms" element={<TermsPrivacyManagement />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);

export default routes;

