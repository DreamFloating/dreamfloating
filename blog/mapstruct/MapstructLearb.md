# Mapstruct Learn

> 在使用 MapStruct 进行对象映射时，可以通过多种方式来忽略某个字段，以便在映射时不包含该字段。下面是常见的方法：
>
> 使用 `@Mapping` 注解忽略字段
>
> 在 `@Mapping` 注解中设置 `ignore = true`，即可在映射时忽略某个字段。
>
> ```
> @Mapper
> public interface MyMapper {
>     @Mapping(target = "ignoredField", ignore = true)
>     TargetObject map(SourceObject source);
> }
> ```
>
> `target` 参数指定目标类中要忽略的字段名称。
>
> `ignore = true` 表示在映射时忽略该字段。
>
> 在目标类中使用 `@Transient`
>
> 如果您想在目标类中永久忽略某个字段，可以在字段上添加 `@Transient` 注解，这样 MapStruct 会自动跳过它。
>
> ```
> public class TargetObject {
>     private String someField;
>     
>     @Transient
>     private String ignoredField;  // 此字段将被忽略
> }
> ```
>
> 使用 `@BeanMapping` 结合 `ignoreByDefault`
>
> 可以使用 `@BeanMapping` 配合 `ignoreByDefault = true` 来只映射特定字段，而忽略其他字段。
>
> ```
> @Mapper
> public interface MyMapper {
>     @BeanMapping(ignoreByDefault = true)
>     @Mapping(target = "includedField", source = "sourceField")
>     TargetObject map(SourceObject source);
> }
> ```