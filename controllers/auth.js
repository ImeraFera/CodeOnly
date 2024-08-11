const User = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

exports.getLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

exports.getRegister = async (req, res) => {

    let messages = res.locals.messages;
    res.render('user/register', { messages });
}

exports.getLogin = async (req, res) => {

    let messages = res.locals.messages;
    res.render('user/login', { messages });
}

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    const schema = Joi.object({

        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
            'string.base': 'Email should be a text.',
            'string.email': 'Please enter a valid email address.',
            'any.required': 'Email is required.',
            'string.empty': 'Email cannot be empty.'
        }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
            'string.base': 'Password should be a text.',
            'string.pattern.base': 'Password should be between 3 and 30 characters long.',
            'any.required': 'Password is required.',
            'string.empty': 'Password cannot be empty.'
        }),

    });

    const { error } = schema.validate({
        email,
        password,
    });

    if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/login');
    }

    try {

        const user = await User.findOne({ email: email })
        const isMatch = await bcrypt.compare(password, user.password)
        const isBanned = user.isBanned;
        if (isBanned) {
            req.flash('error', 'You are banned! If you have questions, contact us.');
            return res.redirect('/login');
        }
        if (isMatch) {
            req.session.isAuth = true;
            req.session.user = user;

            const url = req.query.returnUrl || "/";
            return res.redirect(url);
        } else {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/login');
        }

    } catch (error) {
        console.log(error)
    }
};

exports.postRegister = async (req, res) => {

    const { name, email, password, passwordRepeat } = req.body;

    const schema = Joi.object({
        name: Joi.string().alphanum().min(3).max(25).required().messages({
            'string.base': 'Name should be a text.',
            'string.alphanum': 'Name can only contain alphanumeric characters.',
            'string.min': 'Name should be at least {#limit} characters long.',
            'string.max': 'Name should be at most {#limit} characters long.',
            'any.required': 'Name is required.',
            'string.empty': 'Name cannot be empty.'
        }),

        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
            'string.base': 'Email should be a text.',
            'string.email': 'Please enter a valid email address.',
            'any.required': 'Email is required.',
            'string.empty': 'Email cannot be empty.'
        }),

        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
            'string.base': 'Password should be a text.',
            'string.pattern.base': 'Password should be between 3 and 30 characters long.',
            'any.required': 'Password is required.',
            'string.empty': 'Password cannot be empty.'
        }),

        passwordRepeat: Joi.string().valid(Joi.ref('password')).required().messages({
            'string.base': 'Password confirmation should be a text.',
            'any.only': 'Passwords do not match.',
            'any.required': 'Password confirmation is required.',
            'string.empty': 'Password confirmation cannot be empty.'
        })
    });

    const { error } = schema.validate({
        name,
        email,
        password,
        passwordRepeat
    });

    if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/register');
    }

    try {

        const newUser = await User.create({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 10),
            company: null,
            bio: null,
            img: null,
            score: 0,
            placed: "",
            socialLinks: [],
            role: null,
            projects: [],
            following: [],
            messages: [],
        })

        User.create(newUser);

        req.flash('success', 'Registration successful!');
        res.redirect('/register')

    } catch (error) {
        req.flash('error', 'Email already exists');
        res.redirect('/register');
    }

};
