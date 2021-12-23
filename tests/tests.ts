
import type { Pair, KeysOf, ValuesOf, Variance, Pair_O2N, Pair_M2N } from '../core/TypeDictionary';
//
// TESTS
//
class A { A:string; } 
class B extends A { B:string; } 
class C extends B { C:string; } 
class D { D:string; }

type Dictionaries = {
    tuple: [ Pair<A, C>, Pair<B, A>, Pair<C, D>, Pair<D, null>],
    union: Pair<A, C> | Pair<B, A> | Pair<C, D> | Pair<D, null>,
    nested: [ Pair<A, C>, [[Pair<B, A>] | Pair<C, D>], [[[Pair<D, null>]]]]
}

type Equals<T, U> =
    [T] extends [U] ?
        [U] extends [T] ?
            true
            : false
        : false;

type Dictionary = Dictionaries['nested'];

type Tests =
    //Covariant
    Equals<ValuesOf<Dictionary, A, Variance.Co>, A | C | D>
    | Equals<ValuesOf<Dictionary, B, Variance.Co>, A | D>
    | Equals<ValuesOf<Dictionary, C, Variance.Co>, D>
    | Equals<ValuesOf<Dictionary, D, Variance.Co>, null>
    //Contravariant
    | Equals<ValuesOf<Dictionary, A, Variance.Contra>, C>
    | Equals<ValuesOf<Dictionary, B, Variance.Contra>, A | C>
    | Equals<ValuesOf<Dictionary, C, Variance.Contra>, A | C | D>
    | Equals<ValuesOf<Dictionary, D, Variance.Contra>, null>
    //Invariant
    | Equals<ValuesOf<Dictionary, A>, C>
    | Equals<ValuesOf<Dictionary, B>, A>
    | Equals<ValuesOf<Dictionary, C, Variance.None>, D>
    | Equals<ValuesOf<Dictionary, D, Variance.None>, null>
    //Bivariant
    | Equals<ValuesOf<Dictionary, A, Variance.Bi>, A | C | D>
    | Equals<ValuesOf<Dictionary, B, Variance.Bi>, A | C | D>
    | Equals<ValuesOf<Dictionary, C, Variance.Bi>, A | C | D>
    | Equals<ValuesOf<Dictionary, D, Variance.Bi>, null>
    //Multi-key
    | Equals<ValuesOf<Dictionary, A|D>, C | null>
    | Equals<ValuesOf<Dictionary, A|D, Variance.Co>, A | C | D | null>
    //Link Distributivity
    | Equals<ValuesOf<Pair<A,C> | Pair<A,null>, A>, C | null>
    | Equals<ValuesOf<Pair_O2N<A, C|null>, A>, C | null>
    | Equals<ValuesOf<Pair_M2N<A|D, D|null> | Pair<B,A>, A, Variance.Co>, A | D | null>;

//Only true if all tests are true, otherwise false.
type TestResult = Tests extends true ? true : false;