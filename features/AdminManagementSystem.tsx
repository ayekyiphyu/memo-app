import React, { useState } from 'react';
import {
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Check,
    X,
    Send,
    Download,
    FileText,
    Users,
    Briefcase,
    TrendingUp,
    DollarSign,
    Calendar,
    Building,
    User,
    ChevronDown,
    Plus,
    Bell,
    Settings,
    LogOut,
    Mail,
    Key,
    Shield,
    Slack
} from 'lucide-react';

const AdminManagementSystem = () => {
    const [activeTab, setActiveTab] = useState('staff-management');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    // Type definitions
    type StaffMember = {
        id: number;
        name: string;
        email: string;
        role: 'admin' | 'manager' | 'staff';
        status: 'active' | 'inactive';
        lastLogin: string;
    };

    type Organization = {
        id: number;
        name: string;
        type: 'user' | 'client';
        members: number;
        createdAt: string;
    };

    // Sample data
    const staffMembers: StaffMember[] = [
        { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'admin', status: 'active', lastLogin: '2024-05-20 14:30' },
        { id: 2, name: '佐藤花子', email: 'sato@example.com', role: 'manager', status: 'active', lastLogin: '2024-05-21 09:15' },
        { id: 3, name: '鈴木健太', email: 'suzuki@example.com', role: 'staff', status: 'inactive', lastLogin: '2024-04-15 11:20' }
    ];

    const organizations: Organization[] = [
        { id: 1, name: '株式会社テックソリューション', type: 'user', members: 5, createdAt: '2024-01-10' },
        { id: 2, name: 'デザインスタジオXYZ', type: 'user', members: 3, createdAt: '2024-02-15' },
        { id: 3, name: '送出機関A', type: 'client', members: 12, createdAt: '2024-03-20' }
    ];

    // Components
    const StatusBadge = ({ status }: { status: string }) => {
        const statusClasses = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            admin: 'bg-purple-100 text-purple-800',
            manager: 'bg-blue-100 text-blue-800',
            staff: 'bg-yellow-100 text-yellow-800',
            user: 'bg-indigo-100 text-indigo-800',
            client: 'bg-teal-100 text-teal-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {status === 'active' ? '有効' :
                    status === 'inactive' ? '無効' :
                        status === 'admin' ? '管理者' :
                            status === 'manager' ? 'マネージャー' :
                                status === 'staff' ? 'スタッフ' :
                                    status === 'user' ? 'ユーザー組織' : 'クライアント組織'}
            </span>
        );
    };

    const Sidebar = () => (
        <div className="w-64 bg-white shadow-lg h-screen fixed">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold text-gray-800">Admin Console</h1>
            </div>
            <nav className="mt-6 overflow-y-auto h-[calc(100vh-80px)]">
                {/* スタッフ管理 */}
                <div className="px-4 mb-2 mt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">スタッフ管理</h3>
                </div>
                <button onClick={() => setActiveTab('staff-management')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'staff-management' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <Users className="mr-3 h-5 w-5" />
                    スタッフ一覧
                </button>
                <button onClick={() => setActiveTab('staff-registration')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'staff-registration' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <User className="mr-3 h-5 w-5" />
                    スタッフ登録
                </button>
                <button onClick={() => setActiveTab('staff-invitation')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'staff-invitation' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <Mail className="mr-3 h-5 w-5" />
                    スタッフ招待
                </button>
                <button onClick={() => setActiveTab('webhook-settings')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'webhook-settings' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <Slack className="mr-3 h-5 w-5" />
                    Webhook設定
                </button>

                {/* 組織管理 */}
                <div className="px-4 mb-2 mt-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">組織管理</h3>
                </div>
                <button onClick={() => setActiveTab('user-organizations')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'user-organizations' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <Building className="mr-3 h-5 w-5" />
                    ユーザー組織
                </button>
                <button onClick={() => setActiveTab('client-organizations')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'client-organizations' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <Briefcase className="mr-3 h-5 w-5" />
                    クライアント組織
                </button>

                {/* 求人管理 */}
                <div className="px-4 mb-2 mt-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">求人管理</h3>
                </div>
                <button onClick={() => setActiveTab('job-listings')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'job-listings' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <FileText className="mr-3 h-5 w-5" />
                    求人票一覧
                </button>
                <button onClick={() => setActiveTab('job-approval')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'job-approval' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <Check className="mr-3 h-5 w-5" />
                    求人承認
                </button>

                {/* 求職者管理 */}
                <div className="px-4 mb-2 mt-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">求職者管理</h3>
                </div>
                <button onClick={() => setActiveTab('job-seekers')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'job-seekers' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <Users className="mr-3 h-5 w-5" />
                    求職者一覧
                </button>
                <button onClick={() => setActiveTab('selection-dashboard')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'selection-dashboard' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <TrendingUp className="mr-3 h-5 w-5" />
                    選考ダッシュボード
                </button>

                {/* 請求管理 */}
                <div className="px-4 mb-2 mt-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">請求管理</h3>
                </div>
                <button onClick={() => setActiveTab('invoices')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'invoices' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <DollarSign className="mr-3 h-5 w-5" />
                    請求書管理
                </button>
                <button onClick={() => setActiveTab('payment-notices')} className={`w-full flex items-center px-6 py-3 text-left ${activeTab === 'payment-notices' ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <Send className="mr-3 h-5 w-5" />
                    支払通知書
                </button>
            </nav>
        </div>
    );

    const Header = () => (
        <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center ml-64">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    {activeTab === 'staff-management' && 'スタッフアカウント管理'}
                    {activeTab === 'staff-registration' && 'スタッフアカウント登録'}
                    {activeTab === 'staff-invitation' && 'スタッフ招待'}
                    {activeTab === 'webhook-settings' && 'Webhook通知設定'}
                    {activeTab === 'user-organizations' && 'ユーザー組織管理'}
                    {activeTab === 'client-organizations' && 'クライアント組織管理'}
                    {activeTab === 'job-listings' && '求人票一覧'}
                    {activeTab === 'job-approval' && '求人票公開承認'}
                    {activeTab === 'job-seekers' && '求職者情報一覧'}
                    {activeTab === 'selection-dashboard' && '選考ステータスダッシュボード'}
                    {activeTab === 'invoices' && '請求書管理'}
                    {activeTab === 'payment-notices' && '支払通知書管理'}
                </h2>
            </div>
            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Settings className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">管理者</span>
                </div>
            </div>
        </div>
    );

    const StaffManagement = () => (
        <div className="ml-64 p-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="スタッフを検索..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>すべてのステータス</option>
                            <option>有効</option>
                            <option>無効</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>すべての権限</option>
                            <option>管理者</option>
                            <option>マネージャー</option>
                            <option>スタッフ</option>
                        </select>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        新規登録
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    氏名
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    メールアドレス
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    権限
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ステータス
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    最終ログイン
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {staffMembers.map((staff) => (
                                <tr key={staff.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {staff.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {staff.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={staff.role} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={staff.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {staff.lastLogin}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-yellow-600 hover:text-yellow-900">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        1-3 of 3 staff members
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">Previous</button>
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const OrganizationManagement = ({ type }: { type: 'user' | 'client' }) => (
        <div className="ml-64 p-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder={`${type === 'user' ? 'ユーザー' : 'クライアント'}組織を検索...`}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        新規作成
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    組織名
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    タイプ
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    メンバー数
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    登録日
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {organizations.filter(org => org.type === type).map((org) => (
                                <tr key={org.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {org.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={org.type} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {org.members}人
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {org.createdAt}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-yellow-600 hover:text-yellow-900">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const StaffRegistrationForm = () => (
        <div className="ml-64 p-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">スタッフアカウント登録</h3>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">氏名</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">権限</label>
                                <select
                                    id="role"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="staff">スタッフ</option>
                                    <option value="manager">マネージャー</option>
                                    <option value="admin">管理者</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">ステータス</label>
                                <select
                                    id="status"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="active">有効</option>
                                    <option value="inactive">無効</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                登録する
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    const StaffInvitation = () => (
        <div className="ml-64 p-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">スタッフ招待</h3>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="emails" className="block text-sm font-medium text-gray-700">
                                メールアドレス (複数入力可、カンマ区切り)
                            </label>
                            <textarea
                                id="emails"
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="example1@company.com, example2@company.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">権限</label>
                            <select
                                id="role"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="staff">スタッフ</option>
                                <option value="manager">マネージャー</option>
                                <option value="admin">管理者</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                招待メールを送信
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    const WebhookSettings = () => (
        <div className="ml-64 p-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Webhook通知設定</h3>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700">
                                Slack Webhook URL
                            </label>
                            <input
                                type="text"
                                id="webhook-url"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://hooks.slack.com/services/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                通知するイベント
                            </label>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        id="job-approval"
                                        name="job-approval"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="job-approval" className="ml-2 block text-sm text-gray-700">
                                        求人票の公開申請
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="invoice-created"
                                        name="invoice-created"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="invoice-created" className="ml-2 block text-sm text-gray-700">
                                        請求書の作成
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="payment-notice"
                                        name="payment-notice"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="payment-notice" className="ml-2 block text-sm text-gray-700">
                                        支払通知書の作成
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="new-application"
                                        name="new-application"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="new-application" className="ml-2 block text-sm text-gray-700">
                                        新規応募
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                設定を保存
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'staff-management':
                return <StaffManagement />;
            case 'staff-registration':
                return <StaffRegistrationForm />;
            case 'staff-invitation':
                return <StaffInvitation />;
            case 'webhook-settings':
                return <WebhookSettings />;
            case 'user-organizations':
                return <OrganizationManagement type="user" />;
            case 'client-organizations':
                return <OrganizationManagement type="client" />;
            // Add other cases for job listings, approval, etc.
            default:
                return <StaffManagement />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminManagementSystem;