# Cấu trúc Dự án Math Practice

## 📁 Cấu trúc thư mục

```
app/(tabs)/
├── index.tsx                    # File chính - điểm vào ứng dụng
├── screens/                     # Tất cả các screen
│   ├── index.ts                # Export tất cả screens
│   ├── HomeScreen.tsx          # Màn hình chính
│   ├── AdditionIntroScreen.tsx
│   ├── MultiplicationIntroScreen.tsx
│   ├── ComparisonIntroScreen.tsx
│   ├── OrderingIntroScreen.tsx
│   ├── SudokuIntroScreen.tsx
│   ├── CountingIntroScreen.tsx
│   ├── GeometryIntroScreen.tsx
│   ├── WordProblemsIntroScreen.tsx
│   ├── VideoLessonsIntroScreen.tsx
│   ├── PracticeScreen.tsx
│   └── RankingsScreen.tsx
├── styles/                      # Tất cả StyleSheet
│   └── index.ts                # Định nghĩa tất cả styles
├── constants/                   # Dữ liệu cố định
│   └── categories.ts           # Danh sách danh mục (categories)
└── types/                       # TypeScript types
    └── index.ts                # Định nghĩa types và interfaces
```

## ✨ Lợi ích của cấu trúc này

### 1. **Separation of Concerns (SoC)**
- Mỗi screen có file riêng, dễ bảo trì và mở rộng
- Styles tập trung ở một file duy nhất
- Constants và types được tổ chức riêng

### 2. **Dễ Quản Lý**
- Tìm kiếm và chỉnh sửa screen cụ thể nhanh chóng
- Thay đổi styles ảnh hưởng toàn bộ ứng dụng từ một nơi
- Quản lý dữ liệu categories dễ dàng

### 3. **Tái Sử Dụng Code**
- Styles được import từ một file duy nhất
- Categories data được import từ constants
- Types được import từ folder types

### 4. **Scalability**
- Dễ thêm screen mới
- Dễ thêm styles mới
- Dễ thêm constants mới

## 🚀 Cách sử dụng

### Thêm Screen mới:

```typescript
// screens/NewScreen.tsx
import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { styles } from '../styles';
import { Props } from '../types';

export function NewScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Screen content here */}
      </View>
    </SafeAreaView>
  );
}
```

Sau đó thêm vào `screens/index.ts`:
```typescript
export { NewScreen } from './NewScreen';
```

### Thêm Styles mới:

Thêm vào `styles/index.ts`:
```typescript
newStyle: { 
  // style properties
}
```

### Thêm Constants mới:

Tạo file mới trong `constants/` hoặc thêm vào `categories.ts`

## 📝 Tiêu chuẩn Design

- **Navigation Stack**: Sử dụng React Navigation Native Stack
- **Styling**: StyleSheet từ React Native (tập trung trong styles/index.ts)
- **Type Safety**: TypeScript types được định nghĩa trong types/
- **Constants**: Tất cả dữ liệu cố định trong constants/

## 🔄 Import Pattern

```typescript
// Import screens
import { HomeScreen, AdditionIntroScreen } from './screens';

// Import styles
import { styles } from './styles';

// Import constants
import { categories } from './constants/categories';

// Import types
import { Props, Category } from './types';
```

---

**Tạo bởi**: GitHub Copilot | Cấu trúc theo React Native Best Practices
