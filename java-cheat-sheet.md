# Java Cheat Sheet: Annotations, NIO2, and Functional Programming

## Java Annotations
| Konu | Açıklama | Örnek |
|------|----------|-------|
| **Temel Tanım** | Kodda meta veri sağlayan özel işaretleyiciler | `@Override`, `@Deprecated` |
| **Kullanım Yerleri** | - Sınıflar<br>- Metotlar<br>- Değişkenler<br>- Parametreler<br>- Paketler | `@Entity class User { }` |

### Annotation Tipleri
| Tip | Açıklama | Örnek |
|-----|----------|------|
| **İşaretleme Annotation** | Parametre almaz, sadece işaretler | `@Override` |
| **Tek Değerli Annotation** | Tek bir değer alır | `@SuppressWarnings("unchecked")` |
| **Çok Değerli Annotation** | Birden fazla özellik alır | `@Author(name="Ali", date="01/01/2023")` |

### Meta Annotations
| Meta Annotation | Açıklama |
|----------------|----------|
| **@Target** | Annotation'ın nerede kullanılabileceğini belirtir<br>`ElementType.TYPE`, `METHOD`, `FIELD`, `PARAMETER`, vb. |
| **@Retention** | Annotation'ın ne kadar süre tutulacağını belirtir<br>`RetentionPolicy.SOURCE`, `CLASS`, `RUNTIME` |
| **@Documented** | Javadoc belgelendirmesine dahil edilir |
| **@Inherited** | Alt sınıflara aktarılır |
| **@Repeatable** | Aynı yerde birden fazla kullanılabilir |

### Özel Annotation Tanımlama
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Test {
    String description() default "Açıklama yok";
    Priority priority() default Priority.NORMAL;
}

enum Priority { LOW, NORMAL, HIGH }
```

### Tekrarlanan (Repeatable) Annotation
```java
// Kapsayıcı annotation
@Retention(RetentionPolicy.RUNTIME)
public @interface Tests {
    Test[] value();
}

// Tekrarlanabilir annotation
@Repeatable(Tests.class)
public @interface Test {
    String value();
}

// Kullanım
@Test("Birim Testi")
@Test("Entegrasyon Testi")
public void testMethod() { }
```

## NIO2 (Java 7+)

### Path API
| Metot | Açıklama | Örnek |
|-------|----------|-------|
| `Paths.get()` | Path nesnesi oluşturur | `Path path = Paths.get("/home/user/doc.txt");` |
| `Path.resolve()` | İki yolu birleştirir | `Path file = dir.resolve("data.txt");` |
| `Path.relativize()` | İki yol arasındaki göreli yolu döner | `Path rel = path1.relativize(path2);` |
| `Path.normalize()` | Gereksiz elemanları kaldırır (`..`, `.`) | `path.normalize()` |
| `Path.toAbsolutePath()` | Mutlak yola dönüştürür | `path.toAbsolutePath()` |

### Files API
| Metot | Açıklama | Örnek |
|-------|----------|-------|
| `Files.exists()` | Dosya/dizin var mı kontrol eder | `Files.exists(path, LinkOption.NOFOLLOW_LINKS)` |
| `Files.createFile()` | Dosya oluşturur | `Files.createFile(path)` |
| `Files.createDirectory()` | Dizin oluşturur | `Files.createDirectory(path)` |
| `Files.delete()` | Dosya/dizin siler | `Files.delete(path)` |
| `Files.copy()` | Dosya/dizin kopyalar | `Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING)` |
| `Files.move()` | Dosya/dizin taşır | `Files.move(source, target, StandardCopyOption.ATOMIC_MOVE)` |
| `Files.readAllLines()` | Tüm satırları okur | `List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8)` |
| `Files.write()` | Dosyaya yazar | `Files.write(path, data, StandardOpenOption.APPEND)` |
| `Files.lines()` | Stream olarak satırları okur | `try(Stream<String> stream = Files.lines(path)) { ... }` |

### Dosya Ağacını Dolaşma (Walking the File Tree)
```java
// FileVisitor ile
public class MyFileVisitor extends SimpleFileVisitor<Path> {
    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
        System.out.println("Dosya: " + file);
        return FileVisitResult.CONTINUE;
    }
    
    @Override
    public FileVisitResult visitFileFailed(Path file, IOException exc) {
        return FileVisitResult.SKIP_SUBTREE;
    }
}

Files.walkFileTree(startPath, new MyFileVisitor());

// Stream API ile
try (Stream<Path> paths = Files.walk(startPath)) {
    paths.filter(Files::isRegularFile)
         .forEach(System.out::println);
}
```

### Try-with-resources
```java
// Otomatik kaynak kapatma
try (InputStream in = Files.newInputStream(path);
     BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### Watch Service API
```java
// Dosya/dizin değişikliklerini izleme
WatchService watcher = FileSystems.getDefault().newWatchService();
path.register(watcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);

while (true) {
    WatchKey key = watcher.take(); // Bloklar
    for (WatchEvent<?> event : key.pollEvents()) {
        System.out.println(event.kind() + ": " + event.context());
    }
    key.reset();
}
```

## Fonksiyonel Arayüzler ve Lambda İfadeleri

### Temel Fonksiyonel Arayüzler (java.util.function)
| Arayüz | Tanım | Metot | Örnek Lambda |
|--------|-------|-------|--------------|
| `Function<T,R>` | T → R dönüşümü | `R apply(T t)` | `s -> s.length()` |
| `Predicate<T>` | T → boolean | `boolean test(T t)` | `s -> s.isEmpty()` |
| `Consumer<T>` | T → void | `void accept(T t)` | `s -> System.out.println(s)` |
| `Supplier<T>` | void → T | `T get()` | `() -> new ArrayList<>()` |
| `UnaryOperator<T>` | T → T | `T apply(T t)` | `s -> s.toUpperCase()` |
| `BinaryOperator<T>` | (T,T) → T | `T apply(T t1, T t2)` | `(a,b) -> a+b` |
| `BiFunction<T,U,R>` | (T,U) → R | `R apply(T t, U u)` | `(a,b) -> a+b` |
| `BiPredicate<T,U>` | (T,U) → boolean | `boolean test(T t, U u)` | `(s,n) -> s.length() > n` |
| `BiConsumer<T,U>` | (T,U) → void | `void accept(T t, U u)` | `(k,v) -> map.put(k,v)` |

### Lambda İfadeleri Sözdizimi
```java
// Temel Sözdizimi
(parametreler) -> ifade
(parametreler) -> { ifadeler; }

// Örnekler
Runnable r = () -> System.out.println("Merhaba");
Consumer<String> c = s -> System.out.println(s);
BiFunction<Integer, Integer, Integer> sum = (a, b) -> a + b;
Predicate<String> isEmpty = s -> {
    System.out.println("Kontrol ediliyor: " + s);
    return s.isEmpty();
};
```

### Method Referansları
| Tip | Sözdizimi | Lambda Eşdeğeri |
|-----|-----------|-----------------|
| Statik metot | `ClassName::staticMethod` | `param -> ClassName.staticMethod(param)` |
| Instance metodu | `instance::method` | `param -> instance.method(param)` |
| Nesne instance metodu | `ClassName::method` | `obj -> obj.method()` |
| Constructor | `ClassName::new` | `() -> new ClassName()` |

```java
// Örnekler
Function<String, Integer> strToInt = Integer::parseInt;
Consumer<String> printer = System.out::println;
Supplier<List<String>> listFactory = ArrayList::new;
Function<String, String> toUpper = String::toUpperCase;
```

### Stream API ile Fonksiyonel Programlama
```java
List<String> names = Arrays.asList("Ali", "Ayşe", "Mehmet", "Zeynep");

// Filtreleme ve dönüştürme
List<String> filteredNames = names.stream()
    .filter(name -> name.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());

// Gruplama
Map<Integer, List<String>> byLength = names.stream()
    .collect(Collectors.groupingBy(String::length));

// İstatistikler
IntSummaryStatistics stats = names.stream()
    .mapToInt(String::length)
    .summaryStatistics();
```

### Özel Fonksiyonel Arayüz Oluşturma
```java
@FunctionalInterface
public interface TriFunction<T, U, V, R> {
    R apply(T t, U u, V v);
    
    default <S> TriFunction<T, U, V, S> andThen(Function<? super R, ? extends S> after) {
        Objects.requireNonNull(after);
        return (T t, U u, V v) -> after.apply(apply(t, u, v));
    }
}

// Kullanım
TriFunction<Integer, Integer, Integer, Integer> sum3 = (a, b, c) -> a + b + c;
```
