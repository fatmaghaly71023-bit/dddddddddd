import React, { useState, useEffect } from 'react';
import { Search, User, CheckCircle, XCircle, Calendar, Phone, UserCheck, Clock, AlertTriangle, GraduationCap, MapPin, Bell } from 'lucide-react';
import { Reciter } from '../types';
import { supabase } from '../utils/supabase';

interface RegistrationPageProps {
  isDarkMode?: boolean;
}

// جدول مواعيد الاختبارات حسب الفئة
const examSchedule = {
  "ثلاثة أجزاء": {
    date: "الجمعة، ٨ أغسطس ٢٠٢٥ م",
    hijriDate: "الجمعة، ٦ صفر ١٤٤٧ هـ",
    time: "بعد صلاة الجمعة - ١:٣٠ ظهراً",
    location: "دار المناسبات الشرقيه - دمليج"
  },
  "خمسة أجزاء": {
    date: "السبت، ٩ أغسطس ٢٠٢٥ م",
    hijriDate: "السبت، ٧ صفر ١٤٤٧ هـ",
    time: "١٢:٠٠ ظهراً",
    location: "دار المناسبات الشرقيه - دمليج"
  },
  "ثمانية أجزاء": {
    date: "السبت، ٩ أغسطس ٢٠٢٥ م",
    hijriDate: "السبت، ٧ صفر ١٤٤٧ هـ",
    time: "١٢:٠٠ ظهراً",
    location: "دار المناسبات الشرقيه - دمليج"
  },
  "عشرة أجزاء": {
    date: "الجمعة، ١٥ أغسطس ٢٠٢٥ م",
    hijriDate: "الجمعة، ١٣ صفر ١٤٤٧ هـ",
    time: "بعد صلاة الجمعة - ١:٣٠ ظهراً",
    location: "دار المناسبات الشرقيه - دمليج"
  },
  "خمسة عشر جزءا": {
    date: "الجمعة، ١٥ أغسطس ٢٠٢٥ م",
    hijriDate: "الجمعة، ١٣ صفر ١٤٤٧ هـ",
    time: "بعد صلاة الجمعة - ١:٣٠ ظهراً",
    location: "دار المناسبات الشرقيه - دمليج"
  },
  "عشرون جزءا": {
    date: "الجمعة، ١٥ أغسطس ٢٠٢٥ م",
    hijriDate: "الجمعة، ١٣ صفر ١٤٤٧ هـ",
    time: "بعد صلاة الجمعة - ١:٣٠ ظهراً",
    location: "دار المناسبات الشرقيه - دمليج"
  },
  "خمسة وعشرون جزءا": {
    date: "السبت، ١٦ أغسطس ٢٠٢٥ م",
    hijriDate: "السبت، ١٤ صفر ١٤٤٧ هـ",
    time: "١٢:٠٠ ظهراً",
    location: "دار المناسبات الشرقيه - دمليج"
  },
  "ثلاثون جزءا": {
    date: "السبت، ١٦ أغسطس ٢٠٢٥ م",
    hijriDate: "السبت، ١٤ صفر ١٤٤٧ هـ",
    time: "١٢:٠٠ ظهراً",
    location: "دار المناسبات الشرقيه - دمليج"
  }
};

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ isDarkMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Reciter | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchTotalStudents();
  }, []);

  const fetchTotalStudents = async () => {
    try {
      const { count, error } = await supabase
        .from('reciters')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total students:', error);
        return;
      }

      setTotalStudents(count || 0);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResult(null);
      setSearchAttempted(false);
      return;
    }

    setIsLoading(true);
    setSearchAttempted(true);

    try {
      const { data, error } = await supabase
        .from('reciters')
        .select('*')
        .ilike('name', `%${searchTerm.trim()}%`)
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Search error:', error);
        setSearchResult(null);
      } else {
        setSearchResult(data || null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getExamInfo = (category: string) => {
    return examSchedule[category as keyof typeof examSchedule] || null;
  };

  return (
    <section className={`py-16 min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slideInDown">
            <div className="flex justify-center items-center gap-3 mb-4">
              <UserCheck className="w-12 h-12 text-blue-600 animate-bounce-slow" />
              <h1 className={`text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-gray-100' : 'gradient-text-animated'}`}>
                البحث عن التسجيل
              </h1>
              <Search className="w-12 h-12 text-purple-600 animate-pulse" />
            </div>
            <p className={`text-xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              ابحث عن اسمك للتأكد من التسجيل في المسابقة ومعرفة موعد اختبارك
            </p>
          </div>

          {/* Search Section */}
          <div className={`p-8 rounded-3xl shadow-2xl mb-8 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-gray-600/50' 
              : 'bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className={`flex rounded-2xl overflow-hidden border-2 focus-within:border-blue-500 transition-all duration-300 shadow-lg ${
                  isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                }`}>
                  <div className={`px-6 py-4 flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <User className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="ادخل اسم طالب القرآن للبحث..."
                    className={`flex-1 px-6 py-4 text-right focus:outline-none text-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-100 placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    dir="rtl"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className={`px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg transform hover:scale-105 shadow-xl ${
                  isLoading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    بحث
                  </>
                )}
              </button>
            </div>

            {/* Search Results */}
            {searchAttempted && (
              <div className="animate-fadeIn">
                {searchResult ? (
                  /* Student Found */
                  <div className={`border-2 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-green-900/30 via-emerald-900/30 to-green-900/30 border-green-600/70' 
                      : 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-300'
                  }`}>
                    {/* Background decorative elements */}
                    <div className={`absolute top-4 right-4 opacity-30 ${isDarkMode ? 'text-green-400' : 'text-green-200'}`}>
                      <CheckCircle className="w-16 h-16 animate-pulse" />
                    </div>
                    <div className={`absolute bottom-4 left-4 opacity-20 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-200'}`}>
                      <Calendar className="w-12 h-12 animate-bounce-slow" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-center items-center gap-3 mb-6">
                        <CheckCircle className={`w-12 h-12 animate-pulse ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <h3 className={`text-3xl md:text-4xl font-bold animate-fadeInScale ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                          تم العثور على التسجيل!
                        </h3>
                      </div>
                      
                      <div className={`backdrop-blur-sm rounded-2xl p-6 mb-6 border transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800/70 border-green-600/30' 
                          : 'bg-white/70 border-green-200'
                      }`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <User className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>اسم طالب القرآن</p>
                                <p className={`text-xl font-bold ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                  {searchResult.name}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <GraduationCap className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>الشيخ / المحفظ</p>
                                <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                                  {searchResult.teacher || 'غير محدد'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>الفئة</p>
                                <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                                  {searchResult.category}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Clock className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <div>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>رقم الطالب</p>
                                <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                                  {searchResult.id}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exam Schedule Info */}
                      {getExamInfo(searchResult.category) && (
                        <div className={`border-2 rounded-3xl p-8 mb-6 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-blue-900/30 border-blue-600/70' 
                            : 'bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-blue-300'
                        }`}>
                          <div className="text-center mb-6">
                            <div className="flex justify-center items-center gap-3 mb-4">
                              <Bell className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} animate-ring`} />
                              <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                                موعد اختبارك
                              </h4>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-2xl border transition-colors duration-300 ${
                              isDarkMode 
                                ? 'bg-gray-800/50 border-blue-600/30' 
                                : 'bg-white/70 border-blue-200'
                            }`}>
                              <div className="flex items-center gap-3 mb-4">
                                <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                <h5 className={`text-lg font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>التاريخ</h5>
                              </div>
                              <p className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                {getExamInfo(searchResult.category)?.date}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                {getExamInfo(searchResult.category)?.hijriDate}
                              </p>
                            </div>
                            
                            <div className={`p-6 rounded-2xl border transition-colors duration-300 ${
                              isDarkMode 
                                ? 'bg-gray-800/50 border-blue-600/30' 
                                : 'bg-white/70 border-blue-200'
                            }`}>
                              <div className="flex items-center gap-3 mb-4">
                                <Clock className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                <h5 className={`text-lg font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>الوقت</h5>
                              </div>
                              <p className={`text-lg font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                {getExamInfo(searchResult.category)?.time}
                              </p>
                            </div>
                            
                            <div className={`md:col-span-2 p-6 rounded-2xl border transition-colors duration-300 ${
                              isDarkMode 
                                ? 'bg-gray-800/50 border-blue-600/30' 
                                : 'bg-white/70 border-blue-200'
                            }`}>
                              <div className="flex items-center gap-3 mb-4">
                                <MapPin className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                <h5 className={`text-lg font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>المكان</h5>
                              </div>
                              <a
                                href="https://maps.app.goo.gl/BA3xbuvekc8kgKaMA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-lg font-semibold hover:underline transition-colors ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-600'}`}
                              >
                                {getExamInfo(searchResult.category)?.location}
                              </a>
                            </div>
                          </div>
                          
                          <div className={`mt-6 p-4 rounded-xl text-center ${
                            isDarkMode 
                              ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/50' 
                              : 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300'
                          }`}>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Bell className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} animate-ring`} />
                              <span className={`font-bold ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                                تذكير مهم
                              </span>
                            </div>
                            <p className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                              يرجى الحضور قبل الموعد المحدد بـ 15 دقيقة على الأقل
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Student Not Found */
                  <div className={`border-2 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-red-900/30 via-orange-900/30 to-red-900/30 border-red-600/70' 
                      : 'bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-red-300'
                  }`}>
                    {/* Background decorative elements */}
                    <div className={`absolute top-4 right-4 opacity-30 ${isDarkMode ? 'text-red-400' : 'text-red-200'}`}>
                      <XCircle className="w-16 h-16 animate-pulse" />
                    </div>
                    <div className={`absolute bottom-4 left-4 opacity-20 ${isDarkMode ? 'text-orange-400' : 'text-orange-200'}`}>
                      <AlertTriangle className="w-12 h-12 animate-bounce-slow" />
                    </div>
                    
                    <div className="relative z-10 text-center">
                      <div className="flex justify-center items-center gap-3 mb-6">
                        <XCircle className={`w-12 h-12 animate-pulse ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                        <h3 className={`text-3xl md:text-4xl font-bold animate-fadeInScale ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                          لم يتم العثور على التسجيل
                        </h3>
                      </div>
                      
                      <div className={`backdrop-blur-sm rounded-2xl p-6 mb-6 border transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800/70 border-red-600/30' 
                          : 'bg-white/70 border-red-200'
                      }`}>
                        <p className={`text-xl md:text-2xl leading-relaxed mb-4 ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
                          يرجى التسجيل أولاً مع الشيخ أو المحفظ أو إدارة المسابقة
                        </p>
                        <p className={`text-lg ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                          للتسجيل، يرجى التواصل مع أحد الشيوخ أو المحفظين المعتمدين أو إدارة دار المناسبات الشرقيه
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-600/50' 
                            : 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-200'
                        }`}>
                          <UserCheck className={`w-8 h-8 mx-auto mb-2 animate-bounce-slow ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>التسجيل مع الشيخ/المحفظ</h4>
                          <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>تواصل مع شيخك أو محفظك المعتمد</p>
                        </div>
                        
                        <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-600/50' 
                            : 'bg-gradient-to-r from-green-100 to-green-200 border-green-200'
                        }`}>
                          <Phone className={`w-8 h-8 mx-auto mb-2 animate-pulse ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                          <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>التواصل المباشر</h4>
                          <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>اتصل بإدارة المسابقة</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className={`text-center p-8 rounded-3xl transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-600/50' 
              : 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200'
          }`}>
            <div className="flex justify-center items-center gap-3 mb-6">
              <UserCheck className={`w-10 h-10 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} animate-pulse`} />
              <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
                إحصائيات التسجيل
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-purple-600/30' 
                  : 'bg-white/70 border-purple-200'
              }`}>
                <div className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  {totalStudents}
                </div>
                <p className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>إجمالي طلاب القرآن المسجلين</p>
              </div>
              
              <div className={`p-6 rounded-2xl border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-blue-600/30' 
                  : 'bg-white/70 border-blue-200'
              }`}>
                <div className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  8
                </div>
                <p className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>فئات مختلفة</p>
              </div>
              
              <div className={`p-6 rounded-2xl border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-green-600/30' 
                  : 'bg-white/70 border-green-200'
              }`}>
                <div className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  4
                </div>
                <p className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>أيام اختبارات</p>
              </div>
            </div>
          </div>

          {/* Exam Schedule Table */}
          <div className={`mt-8 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-3">
                <Calendar className="w-8 h-8 animate-bounce-slow" />
                جدول مواعيد الاختبارات حسب الفئة
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-center font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>الفئة</th>
                    <th className={`px-6 py-4 text-center font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>التاريخ الميلادي</th>
                    <th className={`px-6 py-4 text-center font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>التاريخ الهجري</th>
                    <th className={`px-6 py-4 text-center font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(examSchedule).map(([category, schedule], index) => (
                    <tr key={category} className={`border-b transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 hover:bg-gray-600' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <td className={`px-6 py-4 text-center font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {category}
                      </td>
                      <td className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {schedule.date}
                      </td>
                      <td className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {schedule.hijriDate}
                      </td>
                      <td className={`px-6 py-4 text-center font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        {schedule.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quran Verse */}
          <div className={`mt-8 border-2 rounded-3xl p-8 text-center transition-colors duration-300 relative overflow-hidden ${
            isDarkMode 
              ? 'bg-gradient-to-br from-yellow-900/30 via-orange-900/30 to-amber-900/30 border-yellow-500/70' 
              : 'bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-100 border-yellow-400'
          }`}>
            {/* Background decorative elements */}
            <div className={`absolute top-4 right-4 opacity-20 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-300'}`}>
              <UserCheck className="w-16 h-16 animate-pulse" />
            </div>
            <div className={`absolute bottom-4 left-4 opacity-15 ${isDarkMode ? 'text-orange-400' : 'text-orange-300'}`}>
              <Calendar className="w-12 h-12 animate-bounce-slow" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-64 rounded-full bg-gradient-radial from-yellow-300/10 via-orange-300/5 to-transparent animate-pulse-soft"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-center items-center gap-3 mb-6">
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse-glow"></div>
                <UserCheck className="w-8 h-8 text-green-500 animate-pulse" />
                <div className="w-16 h-1 bg-gradient-to-l from-yellow-400 to-orange-400 rounded-full animate-pulse-glow"></div>
              </div>
              
              <p className={`text-2xl md:text-3xl font-bold mb-4 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`} style={{
                textShadow: '0 0 15px rgba(255, 193, 7, 0.8), 0 0 30px rgba(255, 193, 7, 0.6), 0 0 45px rgba(255, 255, 255, 0.4)',
                fontFamily: 'Noto Sans Arabic, serif'
              }}>
                "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
              </p>
              
              <div className="flex justify-center items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-yellow-400"></div>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  صدق الله العظيم - سورة المزمل
                </p>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-yellow-400"></div>
              </div>
              
              <div className="flex justify-center gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 animate-pulse" />
                <Calendar className="w-4 h-4 text-blue-500 animate-pulse" style={{ animationDelay: '1s' }} />
                <UserCheck className="w-5 h-5 text-purple-500 animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};