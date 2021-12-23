
//Core
export type Pair<Key, Value> = [Key, Value] & PairBase;

export const enum Variance { None = 0, Co = 1, Contra = 2, Bi = 3 }

export type KeysOf<Dictionary> = 
    Flatten<Dictionary> extends infer FlatDict ? //Flatten first to catch Dictionary = []
        FlatDict extends never ? //Explicit check for valid dictionary, otherwise some types such
            never               //as never will return unknown as a key inference below.
            : FlatDict extends Pair<infer Key, any> ? 
                Key 
                : never
        : never;

export type ValuesOf<
    Dictionary,
    Key extends KeysOf<Dictionary>,
    KeyVariance extends Variance = Variance.None> =
        Flatten<Dictionary> extends infer FlatDict ? 
            [Key] extends [KeysOf<FlatDict>] ?
                VarianceHandler<FlatDict, Key, KeyVariance>
                : never
            : never;

export type Pair_O2N<Key, Values> = 
    Pair<Key, Flatten<Values>>;

export type Pair_M2N<Keys, Values> = 
    M2N_Helper<Flatten<Keys>, Flatten<Values>>;

//Variance handlers
type VarianceHandler<
    Dictionary, 
    Key extends KeysOf<Dictionary>, 
    KeyVariance extends Variance> =
    {
        0: InvariantKey<Dictionary, Key>,
        1: CovariantKey<Dictionary, Key>,
        2: ContravariantKey<Dictionary, Key>,
        3: BivariantKey<Dictionary, Key>
    } [KeyVariance];

type CovariantKey<Dictionary, Key extends KeysOf<Dictionary>> =
    Key extends any ?
        Dictionary extends Pair<Key, infer Value> ? 
            Value 
            : never
        : never;

type ContravariantKey<Dictionary, Key extends KeysOf<Dictionary>> =
    Key extends any ?
        Dictionary extends any ?
            Pair<Key, never> extends Dictionary ?
                Dictionary extends Pair<any, infer Value> ?
                    Value 
                    : never
                : never
            : never
        : never;

type InvariantKey<Dictionary, Key extends KeysOf<Dictionary>> =
    Key extends any ?
        Dictionary extends any ?
            Pair<Key, never> extends Dictionary ?
                Dictionary extends Pair<Key, infer Value> ?
                    Value
                    : never
                : never
            : never
        : never;

//Packing and unpacking the tuple is to prevent deferred type resolution.
//We can optimize over ToUnion<> since we know this is a non-Pair tuple.
type BivariantKey<Dictionary, Key extends KeysOf<Dictionary>> =
    [CovariantKey<Dictionary, Key>, ContravariantKey<Dictionary, Key>][number];
    
//Helpers
type PairBase = { _isDictionaryPair_2723ae78_ad67_11eb_8529_0242ac130003: true };

type IsTuple<T> = T extends [...any] ? true : false;

type ToUnion<Set> = 
    Set extends PairBase ?
        Set
        : Set extends [...infer U] ? 
            U[number] 
            : Set;

type IsUnion<T> = IsUnion_Helper<T, T>;

type IsUnion_Helper<T, TCopy> = 
    T extends any ? 
        [TCopy] extends [T] ? 
            false
            : true 
        : false;

type Flatten<Set> = 
    [Set] extends [never[]] ?
        never
        : Flatten_Helper<ToUnion<Set>>;

type Flatten_Helper<Set> =
    Set extends PairBase  ?
        Set
        : true extends IsTuple<Set> | IsUnion<Set> ?
            Flatten<Set>
            : Set;

type M2N_Helper<Set1, Set2> =
    Set1 extends any ?
        Pair_O2N<Set1, Set2>
        : never;
