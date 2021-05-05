
//Core
export type Link<Head, Tail> = [Head, Tail] & LinkBase;

export const enum Variance { None = 0, Co = 1, Contra = 2, Bi = 3 }

export type HeadsOf<Links> = 
    Flatten<Links> extends Link<infer Head, any> ? Head : never;

export type TailsFrom<
    Links,
    Head extends HeadsOf<Links>,
    HeadVariance extends Variance = Variance.None> =
        Flatten<Links> extends infer L ? 
            [Head] extends [HeadsOf<L>] ?
                VarianceHandler<L, Head, HeadVariance>
                : never
            : never;

export type Link_O2N<Head, Tails> = 
    Link<Head, Flatten<Tails>>;

export type Link_M2N<Heads, Tails> = 
    M2N_Helper<Flatten<Heads>, Flatten<Tails>>;

//Variance handlers
type VarianceHandler<
    Links, 
    Head extends HeadsOf<Links>, 
    HeadVariance extends Variance> =
    {
        0: InvariantHead<Links, Head>,
        1: CovariantHead<Links, Head>,
        2: ContravariantHead<Links, Head>,
        3: BivariantHead<Links, Head>
    } [HeadVariance];

type CovariantHead<Links, Head extends HeadsOf<Links>> =
    Head extends any ?
        Links extends Link<Head, infer Tail> ? 
            Tail 
            : never
        : never;

type ContravariantHead<Links, Head extends HeadsOf<Links>> =
    Head extends any ?
        Links extends any ?
            Link<Head, never> extends Links ?
                Links extends Link<any, infer Tail> ?
                    Tail 
                    : never
                : never
            : never
        : never;

type InvariantHead<Links, Head extends HeadsOf<Links>> =
    Head extends any ?
        Links extends any ?
            Link<Head, never> extends Links ?
                Links extends Link<Head, infer Tail> ?
                    Tail
                    : never
                : never
            : never
        : never;

//Less fancy than using the default bivariant nature of function arguments,
//but also works if 'strictFunctionTypes' is enabled, so there's that.
//
//ToUnion<[,]> isn't strictly necessary here since you can just union both
//results together directly, but for whatever reason doing this tuple to union
//conversion forces the typescript compiler/linter to fully resolve the aliases.
//Without it sometimes you'd see the type listed as, for example,
//    BivariantHead<Link<A,B> | Link<B,C>, B>
//instead of the fully resolved B | C. It still worked for verifying types and
//showing errors; it was just annoying if you wanted to see what types were available.
type BivariantHead<Links, Head extends HeadsOf<Links>> =
    ToUnion<[CovariantHead<Links, Head>, ContravariantHead<Links, Head>]>;
    
//Helpers
type LinkBase = { _isGraphLink_2723ae78_ad67_11eb_8529_0242ac130003: true };

type IsSet<T> = T extends [...any] ? true : false;

type ToUnion<Set> = 
    Set extends LinkBase ?
        Set
        : Set extends [...infer U] ? 
            U[number] 
            : Set;

type IsUnion<T> = IsUnion_Helper<T, T>;

type IsUnion_Helper<T1, T2> = 
    T1 extends any ? 
        [T2] extends [T1] ? 
            false
            : true 
        : false;

type Flatten<Set> = 
    [Set] extends [never[]] ?
        never
        : Flatten_Helper<ToUnion<Set>>;

type Flatten_Helper<Set> =
    Set extends LinkBase  ?
        Set
        : true extends IsSet<Set> | IsUnion<Set> ?
            Flatten<Set>
            : Set;

type M2N_Helper<Set1, Set2> =
    Set1 extends any ?
        Link_O2N<Set1, Set2>
        : never;
