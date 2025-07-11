/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// RUN: %hermesc -O -emit-binary -out=%t.base.hbc %S/string-table-base.js && %hermesc -dump-bytecode -O -base-bytecode %t.base.hbc %s | %FileCheck --match-full-lines %s
// RUN: %hermesc -O -emit-binary -out=%t.base.hbc %S/string-table-base.js && %hermesc -emit-binary -out=%t.update.hbc -O -base-bytecode %t.base.hbc %s && %hermesc -dump-bytecode %t.update.hbc | %FileCheck --match-full-lines %s

// Compile with delta optimizing mode so the string table should contain all
// strings from string-table-base.js, and with all strings combined and
// correctly deduplicated.
var a = "a";
var c = "c";
var pi = 'π';
var sigma = '𝚺';
var invalid_surrogate_pair = '\ud8d3\ud000';
var invalid_single_surrogate = '\ud800';
var obj = { 'key11': 'val1', 'key2': '再见' };
var Unicode = '\u7231\u9a6c\u4ed5';
var Unicode2 = '\u8138\u4e66';
var ascii = 'hello how are you';
// Use string literal as identifier.
var val1 = 1;

//CHECK:String count: 28

//CHECK-LABEL:Global String Table:
//CHECK-NEXT:  s0[ASCII, {{[0-9]+}}..{{[0-9]+}}]: global
//CHECK-NEXT:  s1[ASCII, {{[0-9]+}}..{{[0-9]+}}]: val1
//CHECK-NEXT:  s2[UTF-16, {{[0-9]+}}..{{[0-9]+}}]: \xC0\x03
//CHECK-NEXT:  s3[UTF-16, {{[0-9]+}}..{{[0-9]+}}]: \x60\x4F\x7D\x59
//CHECK-NEXT:  s4[UTF-16, {{[0-9]+}}..{{[0-9]+}}]: \x00\xD8
//CHECK-NEXT:  s5[UTF-16, {{[0-9]+}}..{{[0-9]+}}]: \x35\xD8\xAA\xDE
//CHECK-NEXT:  s6[UTF-16, {{[0-9]+}}..{{[0-9]+}}]: \x35\xD8\xBA\xDE
//CHECK-NEXT:  s7[UTF-16, {{[0-9]+}}..{{[0-9]+}}]: \xD3\xD8\x00\xD0
//CHECK-NEXT:  i8[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: a
//CHECK-NEXT:  i9[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: obj
//CHECK-NEXT:  i10[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: b
//CHECK-NEXT:  i11[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: gamma
//CHECK-NEXT:  i12[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: pi
//CHECK-NEXT:  i13[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: invalid_single_surrogate
//CHECK-NEXT:  i14[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: invalid_surrogate_pair
//CHECK-NEXT:  i15[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: key1
//CHECK-NEXT:  i16[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: key2
//CHECK-NEXT:  i17[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: sigma
//CHECK-NEXT:  s18[ASCII, {{[0-9]+}}..{{[0-9]+}}]: hello how are you
//CHECK-NEXT:  s19[UTF-16, {{[0-9]+}}..{{[0-9]+}}]: \x8D\x51\xC1\x89
//CHECK-NEXT:  s20[UTF-16, {{[0-9]+}}..{{[0-9]+}}]: \x31\x72\x6C\x9A\xD5\x4E
//CHECK-NEXT:  s21[UTF-16, {{[0-9]+}}..{{[0-9]+}}]: \x38\x81\x66\x4E
//CHECK-NEXT:  i22[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: Unicode
//CHECK-NEXT:  i23[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: Unicode2
//CHECK-NEXT:  i24[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: ascii
//CHECK-NEXT:  i25[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: c
//CHECK-NEXT:  i26[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: key11
//CHECK-NEXT:  i27[ASCII, {{[0-9]+}}..{{[0-9]+}}] #{{[0-9A-Z]+}}: val1
//CHECK-NOT: string-table-update.js
//CHECK-LABEL: Function<global>({{.*}}):
