
import type { Link, KeysOf, ValuesFor, Variance, O2N, M2N } from './TypeLinker';
//
// TESTS
//
class A { A:string; } class B extends A { B:string } class C extends B { C:string } class D { D:string }
type TypeMaps = {
    tuple: [ Link<A, C>, Link<B, A>, Link<C, D>, Link<D, null>],
    union: Link<A, C> | Link<B, A> | Link<C, D> | Link<D, null>,
    nested: [ Link<A, C>, [[Link<B, A>] | Link<C, D>], [[[Link<D, null>]]]],
    default: [ Link<never, never> ]
}
type ActiveMap = TypeMaps['nested'];

//Class example
class example<K extends KeysOf<ActiveMap>, V extends ValuesFor<ActiveMap, K, Variance.Co>> {}
var test: example<A,C>;

//Covariant
var a: ValuesFor<ActiveMap, A, Variance.Co>; //A | C | D
var b: ValuesFor<ActiveMap, B, Variance.Co>; //A | D
var h: ValuesFor<ActiveMap, C, Variance.Co>; //D
var j: ValuesFor<ActiveMap, D, Variance.Co>; //null

//Contravariant
var c: ValuesFor<ActiveMap, A, Variance.Contra>; //C
var d: ValuesFor<ActiveMap, B, Variance.Contra>; //A | C
var i: ValuesFor<ActiveMap, C, Variance.Contra>; //A | C | D
var k: ValuesFor<ActiveMap, D, Variance.Contra>; //null

//Invariant
var e: ValuesFor<ActiveMap, A>; //C
var f: ValuesFor<ActiveMap, B>; //A
var g: ValuesFor<ActiveMap, C, Variance.None>; //D
var l: ValuesFor<ActiveMap, D, Variance.None>; //null

//Bivariant
var m: ValuesFor<ActiveMap, A, Variance.Bi>; //A | C | D
var n: ValuesFor<ActiveMap, B, Variance.Bi>; //A | C | D
var o: ValuesFor<ActiveMap, C, Variance.Bi>; //A | C | D
var p: ValuesFor<ActiveMap, D, Variance.Bi>; //null

//Multi-key
var q: ValuesFor<ActiveMap, A|D>; //C | null
var r: ValuesFor<ActiveMap, A|D, Variance.Co>; //A | C | D | null

//Link Distributivity
var s: ValuesFor<Link<A,C> | Link<A,null>, A>; //C | null
var t: ValuesFor<O2N<A, C|null>, A>; //C | null
var u: ValuesFor<M2N<A|D, D|null> | Link<B,A>, A, Variance.Co>; //A | D | null