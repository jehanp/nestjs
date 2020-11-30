import * as brcypt from 'bcrypt-nodejs';
import {User} from './user.entity';

describe('User Entity', ()=>{
    let user: User;

    beforeEach(()=>{
        user = new User();
        user.password = 'testPassword';
        user.salt = 'testSalt';
        brcypt.hash = jest.fn();
    });

    describe('validate password', ()=>{
        it('returns true as password is valid', async ()=>{
            brcypt.hash.mockReturnValue('testPassword');
            expect(brcypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('123456')
            expect(brcypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
            expect(result).toEqual(true);
        });

        it('returns false as password is invalid', async ()=>{
            brcypt.hash.mockReturnValue('wrongPassword');
            expect(brcypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('wrongPassword')
            expect(brcypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
            expect(result).toEqual(false);
        })
    })
})