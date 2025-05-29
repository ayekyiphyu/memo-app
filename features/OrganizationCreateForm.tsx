import React, { useState } from 'react';
import { Building2, UserPlus, X, ChevronDown, Check, Users, Mail, Globe, Phone, MapPin } from 'lucide-react';

const OrganizationCreateForm = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    basicInfo: {
      organizationName: '',
      organizationType: '',
      industry: '',
      website: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      postalCode: ''
    },
    adminUser: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const organizationTypes = [
    '株式会社',
    '有限会社',
    '合同会社',
    '一般社団法人',
    'NPO法人',
    '個人事業主'
  ];

  const industries = [
    'IT・ソフトウェア',
    '製造業',
    '小売・卸売',
    '医療・福祉',
    '教育',
    '金融・保険',
    '飲食・宿泊',
    '建設・不動産'
  ];

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('組織作成データ:', formData);
    // API呼び出しなどの処理
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* ヘッダー */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="text-blue-600" />
          ユーザー組織新規登録
        </h1>
        <p className="text-gray-600 mt-1">組織情報と管理者アカウントを登録します</p>
      </div>

      {/* ステップインジケーター */}
      <div className="flex mb-8">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div
              className={`flex flex-col items-center ${num <= step ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${num < step ? 'bg-green-100 text-green-600' :
                   num === step ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                {num < step ? <Check size={18} /> : num}
              </div>
              <span className="text-xs mt-1">
                {num === 1 && '基本情報'}
                {num === 2 && '連絡先情報'}
                {num === 3 && '管理者設定'}
              </span>
            </div>
            {num < 3 && (
              <div className={`flex-1 flex items-center px-2 ${num < step ? 'text-blue-600' : ''}`}>
                <div className={`w-full h-1 ${num < step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* フォームコンテンツ */}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
              <Building2 size={18} />
              組織基本情報
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  組織名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.basicInfo.organizationName}
                  onChange={(e) => handleInputChange('basicInfo', 'organizationName', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  組織形態 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500 pr-8"
                    value={formData.basicInfo.organizationType}
                    onChange={(e) => handleInputChange('basicInfo', 'organizationType', e.target.value)}
                    required
                  >
                    <option value="">選択してください</option>
                    {organizationTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  業種 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500 pr-8"
                    value={formData.basicInfo.industry}
                    onChange={(e) => handleInputChange('basicInfo', 'industry', e.target.value)}
                    required
                  >
                    <option value="">選択してください</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ウェブサイト
                </label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    https://
                  </span>
                  <input
                    type="text"
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.basicInfo.website}
                    onChange={(e) => handleInputChange('basicInfo', 'website', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
              <MapPin size={18} />
              連絡先情報
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住所 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder="郵便番号"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={formData.contactInfo.postalCode}
                      onChange={(e) => handleInputChange('contactInfo', 'postalCode', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="住所"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={formData.contactInfo.address}
                      onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
              <UserPlus size={18} />
              管理者アカウント設定
            </h2>
            <p className="text-sm text-gray-600">
              この組織の管理者権限を持つアカウントを作成します
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  氏名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.adminUser.name}
                  onChange={(e) => handleInputChange('adminUser', 'name', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={formData.adminUser.email}
                    onChange={(e) => handleInputChange('adminUser', 'email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.adminUser.password}
                  onChange={(e) => handleInputChange('adminUser', 'password', e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">8文字以上の英数字を含めてください</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード（確認） <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.adminUser.confirmPassword}
                  onChange={(e) => handleInputChange('adminUser', 'confirmPassword', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Users className="text-blue-600" size={16} />
                管理者権限について
              </h3>
              <ul className="list-disc pl-5 mt-2 text-sm text-blue-700 space-y-1">
                <li>組織内の全ユーザーを管理できます</li>
                <li>組織設定の変更が可能です</li>
                <li>請求情報を閲覧できます</li>
                <li>後から権限を変更できます</li>
              </ul>
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              前へ戻る
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
            >
              次へ進む
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700 flex items-center gap-2"
            >
              <Check size={16} />
              組織を作成する
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrganizationCreateForm;