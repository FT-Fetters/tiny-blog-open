---
title: "TypeScript 最佳实践指南"
date: "2024-01-25"
tags: ["TypeScript", "JavaScript", "编程技巧"]
description: "分享在实际项目中使用 TypeScript 的最佳实践，提高代码质量和开发效率。"
---

# TypeScript 最佳实践指南

TypeScript 已经成为现代前端开发的标准选择。本文将分享一些在实际项目中总结的 TypeScript 最佳实践。

## 类型定义策略

### 1. 使用接口定义对象类型

```typescript
// ✅ 推荐
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ❌ 避免
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

### 2. 合理使用联合类型

```typescript
type Status = 'pending' | 'approved' | 'rejected';

interface Task {
  id: string;
  title: string;
  status: Status;
}
```

### 3. 利用泛型提高复用性

```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

## 工具类型的使用

### 1. Utility Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// 创建用户时，排除 id
type CreateUser = Omit<User, 'id'>;

// 更新用户时，所有字段可选
type UpdateUser = Partial<User>;

// 公开用户信息，排除密码
type PublicUser = Omit<User, 'password'>;
```

### 2. 映射类型

```typescript
type UserKeys = keyof User; // 'id' | 'name' | 'email' | 'password'

type UserValues = User[keyof User]; // string

// 创建只读版本
type ReadonlyUser = Readonly<User>;
```

## 严格类型检查

### 1. 启用严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. 避免 any 类型

```typescript
// ❌ 避免
function processData(data: any) {
  return data.something;
}

// ✅ 推荐
function processData<T>(data: T): T {
  return data;
}

// 或者使用 unknown
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // 类型守卫
    return data;
  }
  throw new Error('Invalid data');
}
```

## 类型守卫

### 1. 自定义类型守卫

```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  );
}

// 使用
function handleUserData(data: unknown) {
  if (isUser(data)) {
    // 这里 data 的类型是 User
    console.log(data.name);
  }
}
```

### 2. 联合类型的类型守卫

```typescript
type Shape = Circle | Square;

interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    default:
      // 确保所有情况都被处理
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

## 错误处理

### 1. 使用 Result 模式

```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await api.getUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// 使用
async function handleUser(id: string) {
  const result = await fetchUser(id);
  
  if (result.success) {
    console.log(result.data.name); // 类型安全
  } else {
    console.error(result.error.message);
  }
}
```

## React 中的 TypeScript

### 1. 组件 Props 类型

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

function Button({ children, onClick, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

### 2. Hooks 类型

```typescript
// 自定义 Hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

## 配置优化

### 1. 路径映射

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

### 2. 编译器选项

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "incremental": true,
    "skipLibCheck": true,
    "strict": true
  }
}
```

## 常见陷阱

### 1. 避免过度类型化

```typescript
// ❌ 过度复杂
type ComplexType<T, U, V> = T extends string 
  ? U extends number 
    ? V extends boolean 
      ? T & U & V 
      : never 
    : never 
  : never;

// ✅ 保持简单
interface SimpleConfig {
  name: string;
  count: number;
  enabled: boolean;
}
```

### 2. 正确处理异步类型

```typescript
// ❌ 错误
async function fetchData(): Promise<User | null> {
  try {
    return await api.getUser();
  } catch {
    return null; // 丢失了错误信息
  }
}

// ✅ 正确
async function fetchData(): Promise<User> {
  const user = await api.getUser();
  return user;
}
```

## 总结

TypeScript 最佳实践的核心是：

1. **类型安全优先**：避免使用 any，利用类型系统捕获错误
2. **保持简单**：不要过度设计类型，优先可读性
3. **渐进增强**：从简单类型开始，逐步完善
4. **利用工具**：充分使用编译器和编辑器的类型检查

通过遵循这些实践，我们可以写出更加健壮、可维护的 TypeScript 代码。