import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sameOrigin, sameSecret, isAdmin, signIn, signOut } from '../src/lib/auth';

test('admin password check is constant-time and rejects incorrect credentials',()=>{
  process.env.SESSION_SECRET='security-test-session-secret-32-characters';
  process.env.ADMIN_PASSWORD='admin-test-password-16-characters';
  assert.equal(sameSecret('admin-test-password-16-characters'),true);
  assert.equal(sameSecret('incorrect-password'),false);
});

test('admin signed session can be verified and invalid signature rejected',()=>{
  process.env.SESSION_SECRET='security-test-session-secret-32-characters';
  const store = new Map<string,string>();
  const cookies = {
    set: (key:string,value:string)=>{store.set(key,value);},
    get: (key:string)=>{const value=store.get(key);return value?{value}:undefined;},
    delete: (key:string)=>{store.delete(key);}
  };
  signIn(cookies as never);
  assert.equal(isAdmin(cookies as never),true);
  const original=store.get('indie_admin')||'';
  store.set('indie_admin',original.slice(0,-1)+(original.endsWith('0')?'1':'0'));
  assert.equal(isAdmin(cookies as never),false);
  signOut(cookies as never);
  assert.equal(isAdmin(cookies as never),false);
});

test('cross-origin POST is rejected',()=>{
  assert.equal(sameOrigin(new Request('https://indie.example/api/admin/login',{method:'POST',headers:{origin:'https://evil.example'}})),false);
  assert.equal(sameOrigin(new Request('https://indie.example/api/admin/login',{method:'POST'})),false);
  assert.equal(sameOrigin(new Request('https://indie.example/api/admin/login',{method:'POST',headers:{origin:'https://indie.example'}})),true);
});
