import React, { useState } from 'react';
import {
    Users,
    UserPlus,
    UserCheck,
    Mail,
    Search,
    Webhook,
    Building2,
    FileText,
    CheckCircle,
    UserSearch,
    BarChart3,
    Receipt,
    Send,
    Edit,
    Trash2,
    Settings,
    Bell,
    Filter,
    Eye,
    Download,
    Plus,
    ArrowRight
} from 'lucide-react';

// Define types for our components
type MenuItem = {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    category: string;
    submenu?: SubMenuItem[];
};

type SubMenuItem = {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
};

type DashboardStat = {
    label: string;
    value: string;
    status: string;
    color: string;
};

type RecentActivity = {
    type: string;
    message: string;
    time: string;
    priority: string;
};

type ActionButtonProps = {
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
};

type StatCardProps = {
    stat: DashboardStat;
};

type ActivityItemProps = {
    activity: RecentActivity;
};

type WorkflowCardProps = {
    title: string;
    description: string;
    actions: ActionButtonProps[];
    status: 'active' | 'pending' | 'inactive';
};

const AdminWorkflowUI = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            label: 'ダッシュボード',
            icon: BarChart3,
            category: 'main'
        },
        {
            id: 'staff',
            label: 'スタッフ管理',
            icon: Users,
            category: 'staff',
            submenu: [
                { id: 'staff-register', label: 'アカウント登録', icon: UserPlus },
                { id: 'staff-edit', label: '編集/削除', icon: Edit },
                { id: 'staff-permissions', label: '権限変更', icon: UserCheck },
                { id: 'staff-invite', label: 'スタッフ招待', icon: Mail },
                { id: 'staff-list', label: '一覧・検索', icon: Search },
                { id: 'webhook-settings', label: 'Webhook設定', icon: Webhook }
            ]
        },
        {
            id: 'users',
            label: 'ユーザー管理',
            icon: UserSearch,
            category: 'users',
            submenu: [
                { id: 'user-org-manage', label: '組織情報管理', icon: Building2 },
                { id: 'user-list', label: 'ユーザー情報一覧', icon: Users },
                { id: 'client-org-manage', label: 'クライアント組織管理', icon: Building2 },
                { id: 'client-org-list', label: 'クライアント組織一覧', icon: Search }
            ]
        },
        {
            id: 'jobs',
            label: '求人管理',
            icon: FileText,
            category: 'jobs',
            submenu: [
                { id: 'job-list', label: '求人票一覧', icon: FileText },
                { id: 'job-approval', label: '公開承認', icon: CheckCircle },
                { id: 'applicant-list', label: '求職者情報一覧', icon: UserSearch },
                { id: 'selection-dashboard', label: '選考ステータス管理', icon: BarChart3 }
            ]
        },
        {
            id: 'billing',
            label: '請求管理',
            icon: Receipt,
            category: 'billing',
            submenu: [
                { id: 'invoice-auto', label: '請求書自動作成', icon: Plus },
                { id: 'invoice-list', label: '請求書一覧', icon: Receipt },
                { id: 'invoice-edit', label: '請求書編集・送信', icon: Send },
                { id: 'payment-list', label: '支払通知書一覧', icon: FileText },
                { id: 'payment-edit', label: '支払通知書編集・送信', icon: Send }
            ]
        }
    ];

    const dashboardStats: DashboardStat[] = [
        { label: '新規求人申請', value: '12', status: 'pending', color: 'bg-yellow-500' },
        { label: '承認待ち求人票', value: '8', status: 'pending', color: 'bg-orange-500' },
        { label: '今月の成約数', value: '45', status: 'success', color: 'bg-green-500' },
        { label: '未処理請求書', value: '3', status: 'warning', color: 'bg-red-500' }
    ];

    const recentActivities: RecentActivity[] = [
        { type: 'job_approval', message: '求人票「エンジニア募集」の公開申請が届きました', time: '5分前', priority: 'high' },
        { type: 'invoice', message: '株式会社ABC向け請求書が作成されました', time: '15分前', priority: 'medium' },
        { type: 'staff', message: '新しいスタッフが招待を承諾しました', time: '1時間前', priority: 'low' },
        { type: 'payment', message: '支払通知書の送信が完了しました', time: '2時間前', priority: 'medium' }
    ];

    const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick, variant = 'primary' }) => {
        const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors";
        const variants = {
            primary: "bg-blue-600 hover:bg-blue-700 text-white",
            secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700",
            success: "bg-green-600 hover:bg-green-700 text-white",
            danger: "bg-red-600 hover:bg-red-700 text-white"
        };

        return (
            <button className={`${baseClasses} ${variants[variant]}`} onClick={onClick}>
                <Icon size={16} />
                {label}
            </button>
        );
    };

    const StatCard: React.FC<StatCardProps> = ({ stat }) => (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} opacity-20`}></div>
            </div>
        </div>
    );

    const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => (
        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full mt-2 ${activity.priority === 'high' ? 'bg-red-500' :
                activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
            <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
        </div>
    );

    const WorkflowCard: React.FC<WorkflowCardProps> = ({ title, description, actions, status }) => (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'active' ? 'bg-green-100 text-green-800' :
                    status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {status === 'active' ? 'アクティブ' : status === 'pending' ? '保留中' : '非アクティブ'}
                </span>
            </div>
            <div className="flex gap-2 flex-wrap">
                {actions.map((action, index) => (
                    <ActionButton
                        key={index}
                        icon={action.icon}
                        label={action.label}
                        variant={action.variant}
                        onClick={action.onClick}
                    />
                ))}
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="space-y-8">
            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>

            {/* 主要ワークフロー */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WorkflowCard
                    title="求人票承認ワークフロー"
                    description="公開申請から承認・却下までの一連の流れ"
                    status="active"
                    actions={[
                        { icon: Eye, label: '申請確認', variant: 'primary', onClick: () => setActiveTab('job-approval') },
                        { icon: CheckCircle, label: '一括承認', variant: 'success', onClick: () => { } },
                        { icon: Filter, label: 'フィルター', variant: 'secondary', onClick: () => { } }
                    ]}
                />

                <WorkflowCard
                    title="請求書作成ワークフロー"
                    description="成約データから請求書・支払通知書の自動作成"
                    status="active"
                    actions={[
                        { icon: Plus, label: '自動作成', variant: 'primary', onClick: () => setActiveTab('invoice-auto') },
                        { icon: Receipt, label: '一覧確認', variant: 'secondary', onClick: () => setActiveTab('invoice-list') },
                        { icon: Send, label: '一括送信', variant: 'success', onClick: () => { } }
                    ]}
                />

                <WorkflowCard
                    title="スタッフ管理ワークフロー"
                    description="招待から権限設定までの管理プロセス"
                    status="active"
                    actions={[
                        { icon: UserPlus, label: '新規登録', variant: 'primary', onClick: () => setActiveTab('staff-register') },
                        { icon: Mail, label: '招待送信', variant: 'secondary', onClick: () => setActiveTab('staff-invite') },
                        { icon: UserCheck, label: '権限管理', variant: 'secondary', onClick: () => setActiveTab('staff-permissions') }
                    ]}
                />

                <WorkflowCard
                    title="選考管理ワークフロー"
                    description="全クライアントの選考進捗を一元管理"
                    status="active"
                    actions={[
                        { icon: BarChart3, label: 'ダッシュボード', variant: 'primary', onClick: () => setActiveTab('selection-dashboard') },
                        { icon: Download, label: 'レポート出力', variant: 'secondary', onClick: () => { } },
                        { icon: Bell, label: '通知設定', variant: 'secondary', onClick: () => { } }
                    ]}
                />
            </div>

            {/* 最近のアクティビティ */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">最近のアクティビティ</h2>
                </div>
                <div className="p-3">
                    {recentActivities.map((activity, index) => (
                        <ActivityItem key={index} activity={activity} />
                    ))}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return renderDashboard();
        }

        return (
            <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {menuItems.find(item => item.id === activeTab)?.label ||
                            menuItems.flatMap(item => item.submenu || []).find(sub => sub.id === activeTab)?.label}
                    </h2>
                    <p className="text-gray-600 mb-6">この機能の詳細画面がここに表示されます。</p>
                    <div className="flex gap-3 justify-center">
                        <ActionButton icon={Plus} label="新規作成" />
                        <ActionButton icon={Search} label="検索・フィルター" variant="secondary" />
                        <ActionButton icon={Download} label="エクスポート" variant="secondary" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Admin管理システム</h1>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-600 hover:text-gray-900">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">A</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* サイドバー */}
                <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
                    <nav className="p-4">
                        {menuItems.map((item) => (
                            <div key={item.id} className="mb-2">
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    <span className="font-medium">{item.label}</span>
                                </button>

                                {item.submenu && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {item.submenu.map((subItem) => (
                                            <button
                                                key={subItem.id}
                                                onClick={() => setActiveTab(subItem.id)}
                                                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left transition-colors ${activeTab === subItem.id
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <subItem.icon size={14} />
                                                {subItem.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* メインコンテンツ */}
                <main className="flex-1 p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminWorkflowUI;