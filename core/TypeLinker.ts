//Type map generators
export type M2N<TypeSet1, TypeSet2> = 
    M2N_Helper<ToUnion<TypeSet1>, ToUnion<TypeSet2>>;
export type O2N<TypeSet1, TypeSet2> = Link<TypeSet1, TypeSet2>;

//Core
export type Link<Key, Value> = [Key, Value] & LinkBase;
export enum Variance { None = 0, Co = 1, Contra = 2, Bi = 3 }
export type ValuesFor<
    Links,
    Key extends KeysOf<Links>,
    Variant extends Variance = Variance.None> =
        Flatten<Links> extends infer L ? 
            [Key] extends [KeysOf<L>] ?
                ValuesFor_Impl<L, Key, Variant>
                : never
            : never;
export type KeysOf<Links> = 
    Flatten<Links> extends Link<infer Key, any> ? Key : never;

//Variance handlers
type ValuesFor_Covariant<LinkSet, Key extends KeysOf<LinkSet>> =
    Key extends any ?
        LinkSet extends Link<Key, infer Value> ? 
            Value 
            : never
        : never;
type ValuesFor_Contravariant<LinkSet, Key extends KeysOf<LinkSet>> =
    Key extends any ?
        LinkSet extends any ?
            Link<Key, any> extends LinkSet ?
                LinkSet extends Link<any, infer Value> ?
                    Value 
                    : never
                : never
            : never
        : never;
type ValuesFor_Invariant<LinkSet, Key extends KeysOf<LinkSet>> =
    Key extends any ?
        LinkSet extends any ?
            Link<Key, any> extends LinkSet ?
                LinkSet extends Link<Key, infer Value> ?
                    Value
                    : never
                : never
            : never
        : never;
type ValuesFor_Bivariant<LinkSet, Key extends KeysOf<LinkSet>> =
    Key extends any ?
        LinkSet extends any ?
            ((a:LinkSet)=>void) extends ((a:Link<Key, infer Value>)=>void) ?
                Value 
                : never
            : never
        : never;

//Helpers
type LinkBase = { _isMapperLink_42761: true };
type ValuesFor_Impl<
    LinkSet, 
    Key extends KeysOf<LinkSet>, 
    Variant extends Variance> =
    {
        0: ValuesFor_Invariant<LinkSet, Key>,
        1: ValuesFor_Covariant<LinkSet, Key>,
        2: ValuesFor_Contravariant<LinkSet, Key>,
        3: ValuesFor_Bivariant<LinkSet, Key>
    } [Variant];
type ToUnion<Set> = 
    Set extends LinkBase ?
        Set
        : Set extends [...infer U] ? 
            U[number] 
            : Set;
type Flatten_Helper<Set> =
    Set extends LinkBase  ?
        Set
        : Flatten<Set>;
type Flatten<Set> = 
    [Set] extends [never[]] ?
        never
        : Flatten_Helper<ToUnion<Set>>;
type M2N_Helper<Set1, Set2> =
    Set1 extends any ?
        Set2 extends any ?
            Link<Set1, Set2>
            : never
        : never;