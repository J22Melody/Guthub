var express = require('express');
var app = express();

app.use(require('body-parser')()); 
app.use(static(__dirname + '/app/'));
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost');

// 材料schema
var IngredientsSchema = new Schema({
    amount: {type: Number, min: 1},
    amountUnits: String,
    ingredientName: String
});

// 食谱schema
var RecipeSchema = new Schema({
    title: String,
    description: String,
    ingredients: [IngredientsSchema],
    instructions: String
});

var Recipe = mongoose.model('Recipe', RecipeSchema);

// 列表
var list = function (req, res) {
    Recipe.find({}, function (err, doc) {
        res.send(doc);
    });
};

// 详情
var detail = function (req, res) {
    Recipe.findOne({_id: req.params.id}, function (err, doc) {
        res.send(doc);  
    });
};

// 新增
var add = function (req, res) {
    var recipe = new Recipe(req.body);
    recipe.save(function (err, doc) {
        res.send({state: 1, doc: doc}); 
    });
};

// 修改
var edit = function (req, res) {
    // 删除主键，否则无法保存
    delete req.body._id;

    Recipe.update({_id: req.params.id}, req.body, function (err, numberAffected, raw) {
        res.send({state: 1});
    });
};

// 删除
var del = function (req, res) {
    Recipe.remove({_id: req.params.id}, function (err, doc) {
        res.send({state: 1});
    });
};

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
});

app.get('/recipes/:id', detail);
app.get('/recipes', list);
app.post('/recipes', add);
app.put('/recipes/:id', edit);
app.delete('/recipes/:id', del);

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
