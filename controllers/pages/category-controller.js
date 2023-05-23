const { Category } = require('../../models')

const categoryController = {
    getCategories: (req, res, next) => {
        Promise.all([Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
        ])

            .then(([categories, category]) => { res.render('admin/categories', { categories, category }) })
            .catch(err => next(err))
    },
    postCategories: (req, res, next) => {
        if (!req.body.name) throw new Error('Category name is required')

        Category.create({
            name: req.body.name
        })
            .then(() => res.redirect('/admin/categories'))
            .catch(err => next(err))
    },
    putCategories: (req, res, next) => {
        if (!req.body.name) throw new Error("Category name is required")

        Category.findByPk(req.params.id)
            .then(category => {
                if (!category) throw new Error("Category didn't exist")

                return category.update({
                    name: req.body.name
                })
            })
            .then(() => { res.redirect('/admin/categories') })
            .catch(err => next(err))
    },
    deleteCategories: (req, res, next) => {
        Category.findByPk(req.params.id)
            .then(category => {
                if (!category) throw new Error("Category didn't exist!")

                return category.destroy()
            })
            .then(() => res.redirect('/admin/categories'))
            .catch(err => next(err))
    }
}

module.exports = categoryController