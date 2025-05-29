// import React, { useState } from 'react';
// import {
//     Building2,
//     Users,
//     Mail,
//     Phone,
//     MapPin,
//     Globe,
//     FileText,
//     Save,
//     Eye,
//     ArrowLeft,
//     ArrowRight,
//     Plus,
//     Trash2,
//     Upload,
//     Check,
//     AlertCircle,
//     Info,
//     X
// } from 'lucide-react';

// const UserOrgCreateUI = () => {
//     const [currentStep, setCurrentStep] = useState(1);
//     const [formData, setFormData] = useState({
//         // 基本情報
//         organizationName: '',
//         organizationNameKana: '',
//         organizationType: '',
//         establishedDate: '',
//         employeeCount: '',
//         capital: '',

//         // 連絡先情報
//         postalCode: '',
//         prefecture: '',
//         city: '',
//         address: '',
//         building: '',
//         phoneNumber: '',
//         faxNumber: '',
//         email: '',
//         website: '',

//         // 代表者情報
//         representativeName: '',
//         representativeNameKana: '',
//         representativeTitle: '',
//         representativeEmail: '',
//         representativePhone: '',

//         // 担当者情報
//         contacts: [
//             {
//                 name: '',
//                 nameKana: '',
//                 department: '',
//                 title: '',
//                 email: '',
//                 phone: '',
//                 isPrimary: true
//             }
//         ],

//         // 事業情報
//         businessDescription: '',
//         mainBusiness: '',
//         industries: [],
//         certifications: [],

//         // システム設定
//         permissions: {
//             canCreateJobs: true,
//             canViewApplicants: true,
//             canManageClients: false,
//             maxJobPostings: 10
//         },

//         // その他
//         notes: '',
//         documents: []
//     });

//     const [errors, setErrors] = useState({});
//     const [isPreviewMode, setIsPreviewMode] = useState(false);

//     const organizationTypes = [
//         '株式会社',
//         '有限会社',
//         '合同会社',
//         '個人事業主',
//         '医療法人',
//         '社会福祉法人',
//         'NPO法人',
//         'その他'
//     ];

//     const industries = [
//         'IT・通信業',
//         '製造業',
//         '建設業',
//         '小売業',
//         '卸売業',
//         '金融業',
//         '不動産業',
//         '運輸業',
//         '医療・福祉',
//         '教育',
//         'サービス業',
//         'その他'
//     ];

//     const steps = [
//         { id: 1, title: '基本情報', icon: Building2 },
//         { id: 2, title: '連絡先・住所', icon: MapPin },
//         { id: 3, title: '代表者・担当者', icon: Users },
//         { id: 4, title: '事業情報', icon: FileText },
//         { id: 5, title: '確認・保存', icon: Check }
//     ];

//     const handleInputChange = (field: string, value: string[]) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));

//         // Clear error when user starts typing
//         if (errors[field]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: null
//             }));
//         }
//     };

//     const handleContactChange = (index: number, field: string, value: any) => {
//         const newContacts = [...formData.contacts];
//         newContacts[index] = {
//             ...newContacts[index],
//             [field]: value
//         };
//         setFormData(prev => ({
//             ...prev,
//             contacts: newContacts
//         }));
//     };

//     const addContact = () => {
//         setFormData(prev => ({
//             ...prev,
//             contacts: [
//                 ...prev.contacts,
//                 {
//                     name: '',
//                     nameKana: '',
//                     department: '',
//                     title: '',
//                     email: '',
//                     phone: '',
//                     isPrimary: false
//                 }
//             ]
//         }));
//     };

//     const removeContact = (index) => {
//         if (formData.contacts.length > 1) {
//             const newContacts = formData.contacts.filter((_, i) => i !== index);
//             setFormData(prev => ({
//                 ...prev,
//                 contacts: newContacts
//             }));
//         }
//     };

//     const validateStep = (step) => {
//         const newErrors = {};

//         switch (step) {
//             case 1:
//                 if (!formData.organizationName) newErrors.organizationName = '組織名は必須です';
//                 if (!formData.organizationType) newErrors.organizationType = '組織形態は必須です';
//                 break;
//             case 2:
//                 if (!formData.postalCode) newErrors.postalCode = '郵便番号は必須です';
//                 if (!formData.prefecture) newErrors.prefecture = '都道府県は必須です';
//                 if (!formData.email) newErrors.email = 'メールアドレスは必須です';
//                 break;
//             case 3:
//                 if (!formData.representativeName) newErrors.representativeName = '代表者名は必須です';
//                 if (!formData.contacts[0].name) newErrors.contactName = '担当者名は必須です';
//                 break;
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const nextStep = () => {
//         if (validateStep(currentStep)) {
//             setCurrentStep(prev => Math.min(prev + 1, 5));
//         }
//     };

//     const prevStep = () => {
//         setCurrentStep(prev => Math.max(prev - 1, 1));
//     };

//     const FormField = ({ label, children, required = false, error, help }) => (
//         <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//                 {label}
//                 {required && <span className="text-red-500 ml-1">*</span>}
//             </label>
//             {children}
//             {help && (
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                     <Info size={12} />
//                     {help}
//                 </p>
//             )}
//             {error && (
//                 <p className="text-xs text-red-600 flex items-center gap-1">
//                     <AlertCircle size={12} />
//                     {error}
//                 </p>
//             )}
//         </div>
//     );

//     const Input = ({ type = 'text', value, onChange, placeholder, error, className = '' }) => (
//         <input
//             type={type}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={placeholder}
//             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'
//                 } ${className}`}
//         />
//     );

//     const Select = ({ value, onChange, options, placeholder, error }) => (
//         <select
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'
//                 }`}
//         >
//             <option value="">{placeholder}</option>
//             {options.map((option, index) => (
//                 <option key={index} value={option}>{option}</option>
//             ))}
//         </select>
//     );

//     const Textarea = ({ value, onChange, placeholder, rows = 4, error }) => (
//         <textarea
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={placeholder}
//             rows={rows}
//             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${error ? 'border-red-300' : 'border-gray-300'
//                 }`}
//         />
//     );

//     const renderStep1 = () => (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="組織名" required error={errors.organizationName}>
//                     <Input
//                         value={formData.organizationName}
//                         onChange={(value) => handleInputChange('organizationName', value)}
//                         placeholder="例：株式会社サンプル"
//                         error={errors.organizationName}
//                     />
//                 </FormField>

//                 <FormField label="組織名（カナ）" error={errors.organizationNameKana}>
//                     <Input
//                         value={formData.organizationNameKana}
//                         onChange={(value) => handleInputChange('organizationNameKana', value)}
//                         placeholder="例：カブシキガイシャサンプル"
//                         error={errors.organizationNameKana}
//                     />
//                 </FormField>

//                 <FormField label="組織形態" required error={errors.organizationType}>
//                     <Select
//                         value={formData.organizationType}
//                         onChange={(value) => handleInputChange('organizationType', value)}
//                         options={organizationTypes}
//                         placeholder="組織形態を選択"
//                         error={errors.organizationType}
//                     />
//                 </FormField>

//                 <FormField label="設立年月日">
//                     <Input
//                         type="date"
//                         value={formData.establishedDate}
//                         onChange={(value) => handleInputChange('establishedDate', value)}
//                     />
//                 </FormField>

//                 <FormField label="従業員数">
//                     <Input
//                         type="number"
//                         value={formData.employeeCount}
//                         onChange={(value) => handleInputChange('employeeCount', value)}
//                         placeholder="例：50"
//                     />
//                 </FormField>

//                 <FormField label="資本金">
//                     <Input
//                         value={formData.capital}
//                         onChange={(value) => handleInputChange('capital', value)}
//                         placeholder="例：1000万円"
//                     />
//                 </FormField>
//             </div>
//         </div>
//     );

//     const renderStep2 = () => (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <FormField label="郵便番号" required error={errors.postalCode}>
//                     <Input
//                         value={formData.postalCode}
//                         onChange={(value) => handleInputChange('postalCode', value)}
//                         placeholder="例：123-4567"
//                         error={errors.postalCode}
//                     />
//                 </FormField>

//                 <FormField label="都道府県" required error={errors.prefecture}>
//                     <Input
//                         value={formData.prefecture}
//                         onChange={(value) => handleInputChange('prefecture', value)}
//                         placeholder="例：東京都"
//                         error={errors.prefecture}
//                     />
//                 </FormField>

//                 <FormField label="市区町村">
//                     <Input
//                         value={formData.city}
//                         onChange={(value) => handleInputChange('city', value)}
//                         placeholder="例：渋谷区"
//                     />
//                 </FormField>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="住所">
//                     <Input
//                         value={formData.address}
//                         onChange={(value) => handleInputChange('address', value)}
//                         placeholder="例：道玄坂1-2-3"
//                     />
//                 </FormField>

//                 <FormField label="建物名・階数">
//                     <Input
//                         value={formData.building}
//                         onChange={(value) => handleInputChange('building', value)}
//                         placeholder="例：サンプルビル 5F"
//                     />
//                 </FormField>

//                 <FormField label="電話番号">
//                     <Input
//                         value={formData.phoneNumber}
//                         onChange={(value) => handleInputChange('phoneNumber', value)}
//                         placeholder="例：03-1234-5678"
//                     />
//                 </FormField>

//                 <FormField label="FAX番号">
//                     <Input
//                         value={formData.faxNumber}
//                         onChange={(value) => handleInputChange('faxNumber', value)}
//                         placeholder="例：03-1234-5679"
//                     />
//                 </FormField>

//                 <FormField label="メールアドレス" required error={errors.email}>
//                     <Input
//                         type="email"
//                         value={formData.email}
//                         onChange={(value) => handleInputChange('email', value)}
//                         placeholder="例：info@example.com"
//                         error={errors.email}
//                     />
//                 </FormField>

//                 <FormField label="ウェブサイト">
//                     <Input
//                         value={formData.website}
//                         onChange={(value) => handleInputChange('website', value)}
//                         placeholder="例：https://www.example.com"
//                     />
//                 </FormField>
//             </div>
//         </div>
//     );

//     const renderStep3 = () => (
//         <div className="space-y-8">
//             {/* 代表者情報 */}
//             <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                     <Users size={20} />
//                     代表者情報
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField label="代表者名" required error={errors.representativeName}>
//                         <Input
//                             value={formData.representativeName}
//                             onChange={(value) => handleInputChange('representativeName', value)}
//                             placeholder="例：山田太郎"
//                             error={errors.representativeName}
//                         />
//                     </FormField>

//                     <FormField label="代表者名（カナ）">
//                         <Input
//                             value={formData.representativeNameKana}
//                             onChange={(value) => handleInputChange('representativeNameKana', value)}
//                             placeholder="例：ヤマダタロウ"
//                         />
//                     </FormField>

//                     <FormField label="役職">
//                         <Input
//                             value={formData.representativeTitle}
//                             onChange={(value) => handleInputChange('representativeTitle', value)}
//                             placeholder="例：代表取締役"
//                         />
//                     </FormField>

//                     <FormField label="代表者メール">
//                         <Input
//                             type="email"
//                             value={formData.representativeEmail}
//                             onChange={(value) => handleInputChange('representativeEmail', value)}
//                             placeholder="例：yamada@example.com"
//                         />
//                     </FormField>
//                 </div>
//             </div>

//             {/* 担当者情報 */}
//             <div>
//                 <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                         <Mail size={20} />
//                         担当者情報
//                     </h3>
//                     <button
//                         onClick={addContact}
//                         className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                         <Plus size={16} />
//                         担当者追加
//                     </button>
//                 </div>

//                 {formData.contacts.map((contact, index) => (
//                     <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <h4 className="font-medium text-gray-900">
//                                 担当者 {index + 1}
//                                 {contact.isPrimary && (
//                                     <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                                         主担当者
//                                     </span>
//                                 )}
//                             </h4>
//                             {formData.contacts.length > 1 && (
//                                 <button
//                                     onClick={() => removeContact(index)}
//                                     className="text-red-600 hover:text-red-800"
//                                 >
//                                     <Trash2 size={16} />
//                                 </button>
//                             )}
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <FormField label="担当者名" required={index === 0} error={index === 0 ? errors.contactName : null}>
//                                 <Input
//                                     value={contact.name}
//                                     onChange={(value) => handleContactChange(index, 'name', value)}
//                                     placeholder="例：佐藤花子"
//                                     error={index === 0 ? errors.contactName : null}
//                                 />
//                             </FormField>

//                             <FormField label="担当者名（カナ）">
//                                 <Input
//                                     value={contact.nameKana}
//                                     onChange={(value) => handleContactChange(index, 'nameKana', value)}
//                                     placeholder="例：サトウハナコ"
//                                 />
//                             </FormField>

//                             <FormField label="部署">
//                                 <Input
//                                     value={contact.department}
//                                     onChange={(value) => handleContactChange(index, 'department', value)}
//                                     placeholder="例：人事部"
//                                 />
//                             </FormField>

//                             <FormField label="役職">
//                                 <Input
//                                     value={contact.title}
//                                     onChange={(value) => handleContactChange(index, 'title', value)}
//                                     placeholder="例：課長"
//                                 />
//                             </FormField>

//                             <FormField label="メールアドレス">
//                                 <Input
//                                     type="email"
//                                     value={contact.email}
//                                     onChange={(value) => handleContactChange(index, 'email', value)}
//                                     placeholder="例：sato@example.com"
//                                 />
//                             </FormField>

//                             <FormField label="電話番号">
//                                 <Input
//                                     value={contact.phone}
//                                     onChange={(value) => handleContactChange(index, 'phone', value)}
//                                     placeholder="例：03-1234-5678"
//                                 />
//                             </FormField>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );

//     const renderStep4 = () => (
//         <div className="space-y-6">
//             <FormField label="事業内容">
//                 <Textarea
//                     value={formData.businessDescription}
//                     onChange={(value) => handleInputChange('businessDescription', value)}
//                     placeholder="事業の概要を記入してください"
//                     rows={4}
//                 />
//             </FormField>

//             <FormField label="主力事業">
//                 <Input
//                     value={formData.mainBusiness}
//                     onChange={(value) => handleInputChange('mainBusiness', value)}
//                     placeholder="例：Webシステム開発"
//                 />
//             </FormField>

//             <FormField label="業界" help="複数選択可能です">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                     {industries.map((industry) => (
//                         <label key={industry} className="flex items-center space-x-2">
//                             <input
//                                 type="checkbox"
//                                 checked={formData.industries.includes(industry)}
//                                 onChange={(e) => {
//                                     if (e.target.checked) {
//                                         handleInputChange('industries', [...formData.industries, industry]);
//                                     } else {
//                                         handleInputChange('industries', formData.industries.filter(i => i !== industry));
//                                     }
//                                 }}
//                                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                             />
//                             <span className="text-sm text-gray-700">{industry}</span>
//                         </label>
//                     ))}
//                 </div>
//             </FormField>

//             <FormField label="システム権限設定">
//                 <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
//                     <label className="flex items-center space-x-2">
//                         <input
//                             type="checkbox"
//                             checked={formData.permissions.canCreateJobs}
//                             onChange={(e) => handleInputChange('permissions', {
//                                 ...formData.permissions,
//                                 canCreateJobs: e.target.checked
//                             })}
//                             className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">求人票作成権限</span>
//                     </label>

//                     <label className="flex items-center space-x-2">
//                         <input
//                             type="checkbox"
//                             checked={formData.permissions.canViewApplicants}
//                             onChange={(e) => handleInputChange('permissions', {
//                                 ...formData.permissions,
//                                 canViewApplicants: e.target.checked
//                             })}
//                             className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">求職者情報閲覧権限</span>
//                     </label>

//                     <label className="flex items-center space-x-2">
//                         <input
//                             type="checkbox"
//                             checked={formData.permissions.canManageClients}
//                             onChange={(e) => handleInputChange('permissions', {
//                                 ...formData.permissions,
//                                 canManageClients: e.target.checked
//                             })}
//                             className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">クライアント管理権限</span>
//                     </label>

//                     <FormField label="最大求人投稿数">
//                         <Input
//                             type="number"
//                             value={formData.permissions.maxJobPostings}
//                             onChange={(value) => handleInputChange('permissions', {
//                                 ...formData.permissions,
//                                 maxJobPostings: parseInt(value) || 0
//                             })}
//                             placeholder="10"
//                             className="w-32"
//                         />
//                     </FormField>
//                 </div>
//             </FormField>

//             <FormField label="備考・その他">
//                 <Textarea
//                     value={formData.notes}
//                     onChange={(value) => handleInputChange('notes', value)}
//                     placeholder="追加情報があれば記入してください"
//                     rows={3}
//                 />
//             </FormField>
//         </div>
//     );

//     const renderStep5 = () => (
//         <div className="space-y-6">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
//                     <Check size={20} />
//                     登録内容の確認
//                 </h3>
//                 <p className="text-blue-700">
//                     以下の内容で組織を登録します。内容に間違いがないか確認してください。
//                 </p>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white border rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-3">基本情報</h4>
//                     <dl className="space-y-2 text-sm">
//                         <div className="flex">
//                             <dt className="w-24 font-medium text-gray-600">組織名:</dt>
//                             <dd className="text-gray-900">{formData.organizationName}</dd>
//                         </div>
//                         <div className="flex">
//                             <dt className="w-24 font-medium text-gray-600">形態:</dt>
//                             <dd className="text-gray-900">{formData.organizationType}</dd>
//                         </div>
//                         <div className="flex">
//                             <dt className="w-24 font-medium text-gray-600">従業員数:</dt>
//                             <dd className="text-gray-900">{formData.employeeCount}名</dd>
//                         </div>
//                     </dl>
//                 </div>

//                 <div className="bg-white border rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-3">連絡先</h4>
//                     <dl className="space-y-2 text-sm">
//                         <div className="flex">
//                             <dt className="w-24 font-medium text-gray-600">住所:</dt>
//                             <dd className="text-gray-900">
//                                 {formData.postalCode} {formData.prefecture}{formData.city}{formData.address}
//                             </dd>
//                         </div>
//                         <div className="flex">
//                             <dt className="w-24 font-medium text-gray-600">電話:</dt>
//                             <dd className="text-gray-900">{formData.phoneNumber}</dd>
//                         </div>
//                         <div className="flex">
//                             <dt className="w-24 font-medium text-gray-600">メール:</dt>
//                             <dd className="text-gray-900">{formData.email}</dd>
//                         </div>
//                     </dl>
//                 </div>

//                 <div className="bg-white border rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-3">代表者</h4>
//                     <dl className="space-y-2 text-sm">
//                         <div className="flex">
//                             <dt className="w-24 font-medium text-gray-600">氏名:</dt>
//                             <dd className="text-gray-900">{formData.representativeName}</dd>
//                         </div>
//                         <div className="flex">
//                             <dt className="w-24 font-medium text-gray-600">役職:</dt>
//                             <dd className="text-gray-900">{formData.representativeTitle}</dd>
//                         </div>
//                     </dl>
//                 </div>

//                 <div className="bg-white border rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-3">担当者</h4>
//                     {formData.contacts.map((contact, index) => (
//                         <div key={index} className="mb-2 last:mb-0">
//                             <p className="text-sm font-medium text-gray-900">
//                                 {contact.name}
//                                 {contact.isPrimary && <span className="text-blue-600 ml-1">(主担当)</span>}
//                             </p>
//                             <p className="text-xs text-gray-600">{contact.department} {contact.title}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <div className="flex items-start gap-2">
//                     <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
//                     <div>
//                         <h4 className="font-medium text-yellow-800">登録前の確認事項</h4>
//                         <ul className="text-sm text-yellow-700 mt-1 space-y-1">
//                             <li>• 登録後は一部の情報変更に承認が必要になります</li>
//                             <li>• システム権限は後から変更することができます</li>
//                             <li>• 担当者にはアカウント作成の案内メールが送信されます</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     const renderStepContent = () => {
//         switch (currentStep) {
//             case 1: return renderStep1();
//             case 2: return renderStep2();
//             case 3: return renderStep3();
//             case 4: return renderStep4();
//             case 5: return renderStep5();
//             default: return renderStep1();
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* ヘッダー */}
//             <header className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="px-6 py-4">
//                     <div className="flex items-center gap-4">
//                         <button className="p-2 hover:bg-gray-100 rounded-lg">
//                             <ArrowLeft size={20} />
//                         </button>
//                         <h1 className="text-xl font-semibold text-gray-900">ユーザー組織 新規作成</h1>
//                     </div>
//                 </div>
//             </header>

//             <div className="max-w-4xl mx-auto px-6 py-8">
//                 {/* ステップインジケーター */}
//                 <div className="mb-8">
//                     <div className="flex items-center justify-between">
//                         {steps.map((step, index) => (
//                             <div key={step.id} className="flex items-center">
//                                 <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
//                                         ? 'bg-blue-600 border-blue-600 text-white'
//                                         : 'bg-white border-gray-300 text-gray-400'
//                                     }`}>
//                                     {currentStep > step.id ? (
//                                         <Check size={20} />
//                                     ) : (
//                                         <step.icon size={20} />
//                                     )}
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
//                                         }`}>
//                                         ステップ {step.id}
//                                     </p>
//                                     <p className={`text-xs ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
//                                         }`}>
//                                         {step.title}
//                                     </p>
//                                 </div>
//                                 {index < steps.length - 1 && (
//                                     <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
//                                         }`} />
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* メインコンテンツ */}
//                 <div className="bg-white rounded-lg shadow-sm border p-8">
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold text-gray-900">
//                             {steps.find(s => s.id === currentStep)?.title}
//                         </h2>
//                         <p className="text-gray-600 mt-1">
//                             {currentStep === 1 && '組織の基本情報を入力してください'}
//                             {currentStep === 2 && '連絡先と住所情報を入力してください'}
//                             {currentStep === 3 && '代表者と担当者の情報を入力してください'}
//                             {currentStep === 4 && '事業内容とシステム設定を行ってください'}
//                             {currentStep === 5 && '入力内容を確認して登録を完了してください'}
//                         </p>
//                     </div>

//                     {renderStepContent()}
//                 </div>

//                 {/* フッターボタン */}
//                 <div className="flex items-center justify-between mt-8">
//                     <button
//                         onClick={prevStep}
//                         disabled={currentStep === 1}
//                         className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${currentStep === 1
//                                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                             }`}
//                     >
//                         <ArrowLeft size={16} />
//                         前のステップ
//                     </button>

//                     <div className="flex items-center gap-3">
//                         {currentStep < 5 && (
//                             <button
//                                 onClick={() => setIsPreviewMode(!isPreviewMode)}
//                                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//                             >
//                                 <Eye size={16} />
//                                 プレビュー
//                             </button>
//                         )}

//                         {currentStep < 5 ? (
//                             <button
//                                 onClick={nextStep}
//                                 className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                             >
//                                 次のステップ
//                                 <ArrowRight size={16} />
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={() => {
//                                     alert('組織が正常に登録されました！');
//                                     // ここで実際の登録処理を行う
//                                 }}
//                                 className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                             >
//                                 <Save size={16} />
//                                 登録完了
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 {/* プレビューモーダル */}
//                 {isPreviewMode && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                         <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//                             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
//                                 <h3 className="text-lg font-semibold text-gray-900">登録内容プレビュー</h3>
//                                 <button
//                                     onClick={() => setIsPreviewMode(false)}
//                                     className="p-2 hover:bg-gray-100 rounded-lg"
//                                 >
//                                     <X size={20} />
//                                 </button>
//                             </div>

//                             <div className="p-6 space-y-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="space-y-3">
//                                         <h4 className="font-semibold text-gray-900 border-b pb-2">基本情報</h4>
//                                         <div className="space-y-2 text-sm">
//                                             <div><span className="font-medium">組織名:</span> {formData.organizationName || '未入力'}</div>
//                                             <div><span className="font-medium">組織名（カナ）:</span> {formData.organizationNameKana || '未入力'}</div>
//                                             <div><span className="font-medium">組織形態:</span> {formData.organizationType || '未入力'}</div>
//                                             <div><span className="font-medium">設立年月日:</span> {formData.establishedDate || '未入力'}</div>
//                                             <div><span className="font-medium">従業員数:</span> {formData.employeeCount || '未入力'}</div>
//                                             <div><span className="font-medium">資本金:</span> {formData.capital || '未入力'}</div>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-3">
//                                         <h4 className="font-semibold text-gray-900 border-b pb-2">連絡先情報</h4>
//                                         <div className="space-y-2 text-sm">
//                                             <div><span className="font-medium">郵便番号:</span> {formData.postalCode || '未入力'}</div>
//                                             <div><span className="font-medium">住所:</span> {`${formData.prefecture}${formData.city}${formData.address}${formData.building}` || '未入力'}</div>
//                                             <div><span className="font-medium">電話番号:</span> {formData.phoneNumber || '未入力'}</div>
//                                             <div><span className="font-medium">FAX:</span> {formData.faxNumber || '未入力'}</div>
//                                             <div><span className="font-medium">メール:</span> {formData.email || '未入力'}</div>
//                                             <div><span className="font-medium">ウェブサイト:</span> {formData.website || '未入力'}</div>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-3">
//                                         <h4 className="font-semibold text-gray-900 border-b pb-2">代表者情報</h4>
//                                         <div className="space-y-2 text-sm">
//                                             <div><span className="font-medium">代表者名:</span> {formData.representativeName || '未入力'}</div>
//                                             <div><span className="font-medium">代表者名（カナ）:</span> {formData.representativeNameKana || '未入力'}</div>
//                                             <div><span className="font-medium">役職:</span> {formData.representativeTitle || '未入力'}</div>
//                                             <div><span className="font-medium">メール:</span> {formData.representativeEmail || '未入力'}</div>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-3">
//                                         <h4 className="font-semibold text-gray-900 border-b pb-2">担当者情報</h4>
//                                         <div className="space-y-3">
//                                             {formData.contacts.map((contact, index) => (
//                                                 <div key={index} className="bg-gray-50 p-3 rounded">
//                                                     <div className="font-medium text-sm mb-1">
//                                                         担当者{index + 1} {contact.isPrimary && '(主担当)'}
//                                                     </div>
//                                                     <div className="space-y-1 text-xs text-gray-600">
//                                                         <div>氏名: {contact.name || '未入力'}</div>
//                                                         <div>部署: {contact.department || '未入力'}</div>
//                                                         <div>メール: {contact.email || '未入力'}</div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-3">
//                                     <h4 className="font-semibold text-gray-900 border-b pb-2">事業情報</h4>
//                                     <div className="space-y-2 text-sm">
//                                         <div><span className="font-medium">事業内容:</span> {formData.businessDescription || '未入力'}</div>
//                                         <div><span className="font-medium">主力事業:</span> {formData.mainBusiness || '未入力'}</div>
//                                         <div><span className="font-medium">業界:</span> {formData.industries.length > 0 ? formData.industries.join(', ') : '未選択'}</div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-3">
//                                     <h4 className="font-semibold text-gray-900 border-b pb-2">システム権限</h4>
//                                     <div className="space-y-2 text-sm">
//                                         <div>求人票作成権限: {formData.permissions.canCreateJobs ? '有効' : '無効'}</div>
//                                         <div>求職者情報閲覧権限: {formData.permissions.canViewApplicants ? '有効' : '無効'}</div>
//                                         <div>クライアント管理権限: {formData.permissions.canManageClients ? '有効' : '無効'}</div>
//                                         <div>最大求人投稿数: {formData.permissions.maxJobPostings}件</div>
//                                     </div>
//                                 </div>

//                                 {formData.notes && (
//                                     <div className="space-y-3">
//                                         <h4 className="font-semibold text-gray-900 border-b pb-2">備考</h4>
//                                         <div className="text-sm">{formData.notes}</div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UserOrgCreateUI;