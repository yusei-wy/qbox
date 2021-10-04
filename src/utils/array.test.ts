import { contain, merge, replace } from './array';

type User = {
  id: string;
  age: number;
};

const users: User[] = [
  { id: 'user1', age: 20 },
  { id: 'user2', age: 30 },
  { id: 'user3', age: 40 },
];

describe('array', () => {
  it('contain', () => {
    expect(contain<number>([], 0)).toBeFalsy();
    expect(contain<number>([], null)).toBeFalsy();
    expect(contain<number>([], NaN)).toBeFalsy();
    expect(contain<number>([NaN], NaN)).toBeFalsy();
    expect(contain<string>([], '')).toBeFalsy();
  });

  it('unique', () => {
    expect(merge<User>(users, [], (a, b) => a.id === b.id)).toEqual(users);
    expect(merge<User>(users, [{ id: 'user1', age: 30 }], (a, b) => a.id === b.id)).toEqual(users);
    expect(merge<User>(users, [{ id: 'user4', age: 50 }], (a, b) => a.id === b.id)).toEqual([
      ...users,
      { id: 'user4', age: 50 },
    ]);
  });

  it('replace', () => {
    expect(
      replace<User>(
        users,
        (u) => u.id === 'xxx',
        (u) => ({ id: u.id, age: -1 }),
      ),
    ).toEqual(users);

    const newUsers = users.map((u) => (u.id === 'user1' ? { id: u.id, age: -1 } : u));
    expect(
      replace<User>(
        users,
        (u) => u.id === 'user1',
        (u) => ({ id: u.id, age: -1 }),
      ),
    ).toEqual(newUsers);
  });
});
