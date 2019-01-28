const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');

app.use(bodyParser.json())

const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'justifyester',
    password: 'justifyester123',
    database: 'moviebertasbih',
    port: 3306
});

const port = process.env.port || 2019;

//Tampilan Awal API
app.get ('/', function(req,res) {
    res.send('<h1>Selamat Datang di Movie Bertasbih :)</h1>')
})

//Memulai CRUD Movies :

//Pertama Get Semua List dari table : movies
app.get('/movieslist', function(req,res) {
    var sql = `select * from movies;`
    db.query(sql, function(err,results) {
        if(err) throw err;
        res.send(results)
    })
})

//Kedua Insert(menambah list movie) dari table : movies
//Ingat ini di-tes menggunakan postman 
app.post('/addmovies', function(req,res) {
    //Catatan :
    // 1. Kita siapkan nama variabel baru untuk menampung list movies baru
    // 2. Kita juga menambahkan query yang ditampung di varibel sql
    var newMovies = {
        nama : req.body.nama,
        tahun : req.body.tahun,
        description : req.body.description
    }
    var sql = `insert into movies set ?;`
    db.query(sql, newMovies, function(err,results) {
        if(err) throw err;
        //res.send(results)
    })
    //Kemudian kita select lagi semua isi dari tabel movies
    sql = `select * from movies;`
    db.query(sql, function(err,res1) {
        if(err) throw err;
        res.send(res1)
    })

})

//Ketiga kita Edit table movies dengan menggunakan method put
app.put('/updatemovies/:id', function(req,res) {
    var idmovies = req.params.id;
    var newUpdateMovies = {
        nama : req.body.nama,
        tahun : req.body.tahun,
        description : req.body.description
    }
    var sql = `update movies set ? where id=${idmovies};`;
    db.query(sql, newUpdateMovies, function(err,res) {
        if(err) throw err;
        //res.send(res)
    })

    sql = `select * from movies;`
    db.query(sql, function(err,res1) {
        if(err) throw err;
        res.send(res1)
    })
})

//Keempat kita meng-delete isi table movies, jika ingin meng-delete tetap menggunakan method delete
app.delete('deletemovies/:id', function(req,results) {
    var idmovies = req.params.id;
    var sql = `delete from movies where id = ${idmovies}`
    db.query(sql, function(err,res) {
        if(err) throw err;
    })

    sql = `delete from moviecat where idmovie=${idmovies}`
    db.query(sql, function(err,results1) {
        if(err) throw err;

    //meng-select semua isi table movies 
    sql = `select * from movies;`
    db.query(sql, function(err,res1) {
        if(err) throw err;
        res.send(res1)
    })
    })
})

//Memulai CRUD untuk categories

//Pertama Get semua isi table categories
app.get('/categorieslist', function(req,res) {
    var sql = `select * from categories;`
    db.query(sql, function(err,results) {
        if(err) throw err;
        res.send(results)
    })
})

//Kedua kita Insert(menambahkan) isi dari nama categories menggunakan method post
app.post('/addcategories', function(req,res) {
    var sql = `insert into categories set nama='${req.body.nama}';`

    db.query(sql, function(err,results) {
        if(err) throw err;
    })

    var sql = `select * from categories;`
    db.query(sql, function(err,results1) {
        if(err) throw err;
        res.send(results1)
    })

})

//Ketiga kita Edit(meng-update) isi dari nama table categories menggunakan method put
app.put('/updatecategories/:id', function(req,res) {
    var idcategories = req.params.id;
    var newCategories = {
        nama : req.body.nama
    }

    var sql = `update categories set ? where id=${idcategories};`
    db.query(sql,newCategories, function(err,results){
        if(err) throw err
    })

    var sql = `select * from categories;`
    db.query(sql, function(err,results1) {
        if(err) throw err;
        res.send(results1)
    })
})

//Keempat kita meng-hapus isi dari table categories menggunakan method delete
app.delete('/deletecategories/:id', function(req,res) {
    var idcategories = req.params.id
    var sql = `delete from categories where id = ${idcategories}`
    db.query(sql, function(err,results) {
        if(err) throw err;
    })

    sql = `delete from moviecat where idcategory=${idcategories}`
    db.query(sql, function(err,res1) {
        if(err) throw err
    })

    var sql = `select * from categories;`
    db.query(sql, function(err,results1) {
        if(err) throw err
        res.send(results1)
    })
})

//Memulai CRUD Gabungan dari table movies dengan table categories

//Pertama kita meng-join(menggabungkan) isi dari table movies dengan table categories berdasarkan id mereka
//Sehingga kita bisa mengetahui isi gabungan table tersebut
app.get('/mclist', function(req,res) {
    var sql = `select m.nama as namaMovie, c.nama as namaCategory
                from movies m
                join moviecat mc
                on m.id = mc.idmovie
                join categories c
                on c.id = mc.idcategory;`
    db.query(sql, function(err,results){
        if(err) throw err;
        res.send(results)
    })
})

//Kedua kita meng-add isi dari gabungan table movies dengan categories menggunakan method post
app.post('/addmc', function(req,res) {
    var sql = `select id from categories where nama = '${req.body.namaCategory}'`
    db.query(sql, function(err,res1) {
        if(err) throw err;
        console.log(res1)
    })
    var idcategories = res1[0].id
    console.log(idcategories)
    sql = `select id from movies where nama = '${req.body.namaMovie}';`
    db.query(sql, function(err,res2) {
        if(err) throw err
        console.log(res2)
    })
    var idmovies = res2[0].id
    console.log(idmovies)
    sql = `insert into moviecat values (${idmovies},${idcategories})`
    db.query(sql, function(err,res3){
        if(err) throw err
        res.send(res3)
    })
})

//Ketiga kita menghapus isi dari gabungan table movies dengan categories
app.delete('/deletemc', function(req,res) {
    var {namaMovie, namaCategory} = req.body
    var sql = `delete moviecat from moviecat 
                join movies m 
                on m.id = moviecat.idmovie
                join categories c 
                on c.id = moviecat.idcategory
                where m.nama='${namaMovie}' and c.nama='${namaCategory}';`
    db.query(sql, function(err,results1) {
        if(err) throw err
        res.send(results1)
        console.log(results1)
    })
    sql = `select m.nama as namaMovie, c.nama as namaCategory
            from movies m
            join moviecat mc
            on m.id = mc.idmovie
            join categories c
            on c.id = mc.idcategory;`
    db.query(sql, function(err,res1) {
        if(err) throw err
        res.send(res1)
    })
})

app.listen(port, () => console.log(`API aktif pada port : ${port}`))