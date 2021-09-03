
//Core
export type Link<Head, Tail> = [Head, Tail] & LinkBase;

export const enum Variance { None = 0, Co = 1, Contra = 2, Bi = 3 }

export type HeadsOf<Graph> = 
    Flatten<Graph> extends infer G ? //Flatten first to catch Graph = []
        G extends never ? //Explicit check for valid graph, otherwise some types such
            never         //as never will return unknown as a head inference below.
            : G extends Link<infer Head, any> ? 
                Head 
                : never
        : never;

export type TailsOf<
    Graph,
    Head extends HeadsOf<Graph>,
    HeadVariance extends Variance = Variance.None> =
        Flatten<Graph> extends infer L ? 
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

//Packing and unpacking the tuple is to prevent deferred type resolution.
//We can optimize over ToUnion<> since we know this is a non-Link tuple.
type BivariantHead<Links, Head extends HeadsOf<Links>> =
    [CovariantHead<Links, Head>, ContravariantHead<Links, Head>][number];
    
//Helpers
type LinkBase = { _isGraphLink_2723ae78_ad67_11eb_8529_0242ac130003: true };

type IsTuple<T> = T extends [...any] ? true : false;

type ToUnion<Set> = 
    Set extends LinkBase ?
        Set
        : Set extends [...infer U] ? 
            U[number] 
            : Set;

type IsUnion<Set> = IsUnion_Helper<Set, Set>;

type IsUnion_Helper<Set, SetCopy> = 
    Set extends any ? 
        [SetCopy] extends [Set] ? 
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
        : true extends IsTuple<Set> | IsUnion<Set> ?
            Flatten<Set>
            : Set;

type M2N_Helper<Set1, Set2> =
    Set1 extends any ?
        Link_O2N<Set1, Set2>
        : never;
