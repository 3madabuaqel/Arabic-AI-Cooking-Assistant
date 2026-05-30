import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { ArrowLeft, LockKeyhole } from 'lucide-react-native'; // تأكدي من وجود هذا السطر
const ForgotPasswordScreen = ({ navigation }) => {
  // حالة لإظهار بطاقة التأكيد في الأسفل (Check your email)
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSendCode = () => {
    // في الوضع الطبيعي، ستقومين باستدعاء API هنا
    // سنقوم فقط بإظهار بطاقة التأكيد الآن
    setShowConfirmation(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. الخلفية البيضاء المركزية المستديرة (Card) */}
      <ScrollView contentContainerStyle={styles.centerContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          
          {/* 2. زر الرجوع - يربط بشاشة الـ Login */}
          <TouchableOpacity style={styles.backBtnAction} onPress={() => navigation.goBack()}>
            <View style={styles.backCircle}>
              <ArrowLeft color="#2D8C46" size={24} />
            </View>
          </TouchableOpacity>

          {/* 3. حاوية الأيقونة (المربع الأخضر الفاتح) */}
          <View style={styles.iconHederWrapper}>
            <View style={styles.lightGreenIconBox}>
              {/* أيقونة القفل وسهم إعادة التعيين */}
              <LockKeyhole color="#2D8C46" size={36} />
            </View>
          </View>

          {/* 4. النص الرئيسي */}
          <Text style={styles.titleText}>Forgot Password</Text>

          {/* 5. حقل إدخال الإيميل */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View style={styles.inputWrapper}>
              {/* أيقونة المغلف داخل الحقل */}
              <Mail color="#BBB" size={18} style={styles.innerIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="your@email.com" 
                placeholderTextColor="#BBB"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* 6. زر إرسال الكود */}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSendCode}>
              <Text style={styles.primaryBtnText}>Send code</Text>
            </TouchableOpacity>
          </View>

          {/* 7. النص السفلي للعودة لتسجيل الدخول */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.greenBold}>Log In</Text>
            </TouchableOpacity>
          </View>

          {/* 8. بطاقة التأكيد (تظهر فقط عند الضغط على الزر) */}
          {showConfirmation && (
            <View style={styles.confirmationBadge}>
              <CheckCircle color="#2D8C46" size={20} style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Check your email for the reset link</Text>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- التنسيقات (Styles) الدقيقة المحاكية للتصميم ---
const styles = StyleSheet.create({
  // الحاوية الخارجية للخلفية الرمادية الفاتحة
  container: {
    flex: 1,
    backgroundColor: '#F5F7F6', 
  },
  
  // حاوية التمركز والمحاذاة
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  
  // حاوية البطاقة البيضاء (Card)
  cardContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 420, // أقصى عرض لتبدو مثل الجوال حتى على المتصفح
    borderRadius: 35, // حواف دائرية كبيرة
    padding: 30, // مسافة داخلية بيضاء
    // الظل الاحترافي
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    alignItems: 'center', // محاذاة كل شيء للمنتصف
  },

  // زر الرجوع في الجزء الأبيض
  backBtnAction: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backCircle: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: '#EBF4ED', // أخضر فاتح جداً
    justifyContent: 'center', 
    alignItems: 'center',
  },

  // حاوية الأيقونة
  iconHederWrapper: {
    marginVertical: 20,
  },
  lightGreenIconBox: {
    width: 80,
    height: 80,
    backgroundColor: '#E1F0E6', // لون المربع الأخضر الفاتح في التصميم
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // النصوص الرئيسية
  titleText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 40,
    textAlign: 'center',
  },

  // تنسيق الحقول (Inputs)
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textTransform: 'uppercase', // تحويل النص لأحرف كبيرة
    letterSpacing: 0.5, // مسافة بين الأحرف
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // خلفية رمادية فاتحة للحقل
    borderRadius: 20, // حواف دائرية للحقول
    paddingHorizontal: 16,
    height: 55, // ارتفاع ثابت ومريح
  },
  innerIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  // الأزرار
  primaryBtn: {
    backgroundColor: '#2D8C46', // اللون الأخضر الأساسي
    paddingVertical: 18,
    borderRadius: 30, // زر مستدير بالكامل
    alignItems: 'center',
    marginTop: 20,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // الفواصل والروابط السفلى
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  greenBold: {
    color: '#2D8C46',
    fontWeight: 'bold',
  },

  // بطاقة التأكيد (Check your email badge)
  confirmationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F2E9', // خلفية البطاقة الخضراء الفاتحة
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
    marginTop: 10,
    width: '100%',
  },
  badgeIcon: {
    marginRight: 10,
  },
  badgeText: {
    color: '#2D8C46', // لون النص الأخضر
    fontSize: 13,
    fontWeight: '600',
    flex: 1, // السماح للنص بالالتفاف
  }
});

export default ForgotPasswordScreen;