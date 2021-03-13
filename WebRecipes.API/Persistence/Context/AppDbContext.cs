using System.Runtime.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebRecipes.API.Domain.Models;
using System.Threading.Tasks;
using WebRecipes.API.Helpers;

namespace WebRecipes.API.Persistence.Contexts
{

    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Level> Levels { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Meal> Meals { get; set; }
        public DbSet<Mark> Marks { set; get; }
        public DbSet<Subscription> Subscriptions { set; get; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            //  Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        public List<Recipe> GetDefaultRecipes()
        {
            string json = string.Empty;
            List<Recipe> recipes = new List<Recipe>();
            try
            {
                string path = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"Data\defaultRecipes.json");
                using (StreamReader sr = new StreamReader(path, System.Text.Encoding.Default))
                {
                    string line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        json += line;
                    }
                }
                recipes = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Recipe>>(json);
            }
            catch { }
            return recipes;
        }
        public List<User> GetDefaultUsers()
        {
            string json = string.Empty;
            List<User> users = new List<User>();
            try
            {
                string path = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"Data\defaultUsers.json");
                using (StreamReader sr = new StreamReader(path, System.Text.Encoding.Default))
                {
                    string line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        json += line;
                    }
                    users = Newtonsoft.Json.JsonConvert.DeserializeObject<List<User>>(json);
                }
            }
            catch { }
            return users;
        }
        public List<Subscription> GetDefaultSubscriptions()
        {
            string json = string.Empty;
            List<Subscription> subscription = new List<Subscription>();
            try
            {
                string path = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"Data\defaultSubscriptions.json");
                using (StreamReader sr = new StreamReader(path, System.Text.Encoding.Default))
                {
                    string line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        json += line;
                    }
                    subscription = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Subscription>>(json);
                }
            }
            catch { }
            return subscription;
        }
        public List<Like> GetDefaultLikes()
        {
            string json = string.Empty;
            List<Like> likes = new List<Like>();
            try
            {
                string path = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"Data\defaultLikes.json");
                using (StreamReader sr = new StreamReader(path, System.Text.Encoding.Default))
                {
                    string line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        json += line;
                    }
                    likes = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Like>>(json);
                }
            }
            catch { }
            return likes;
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //RECIPE CATEGORY--------------------------------------
            // builder.Entity<RecipeCategory>()
            //     .HasKey(t => new { t.RecipeId, t.CategoryId });

            builder.Entity<Recipe>().HasKey(p => p.Id);
            builder.Entity<Recipe>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            var tmp_recipes = GetDefaultRecipes();
            builder.Entity<Recipe>().HasData
            (
                tmp_recipes
            );

            // builder.Entity<RecipeCategory>()
            //     .HasOne(sc => sc.Recipe)
            //     .WithMany(s => s.RecipeCategories)
            //     .HasForeignKey(sc => sc.RecipeId);

            // builder.Entity<RecipeCategory>()
            //     .HasOne(sc => sc.Category)
            //     .WithMany(c => c.RecipeCategories)
            //     .HasForeignKey(sc => sc.CategoryId);

            // //--------------------------------------

            builder.Entity<User>().HasKey(p => p.Id);
            builder.Entity<User>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();

            var tmp_users = GetDefaultUsers();
            builder.Entity<User>().HasData
            (
                tmp_users
            );

            builder.Entity<Like>().HasKey(p => p.Id);
            builder.Entity<Like>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();

            var tmp_likes = GetDefaultLikes();
            builder.Entity<Like>().HasData
            (
                tmp_likes
            );

            builder.Entity<Subscription>().HasKey(p => p.Id);
            builder.Entity<Subscription>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();

            var tmp_subscription = GetDefaultSubscriptions();
            builder.Entity<Subscription>().HasData
            (
                tmp_subscription
            );

            builder.Entity<Mark>().HasKey(p => p.Id);
            builder.Entity<Mark>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();

            builder.Entity<Comment>().HasKey(p => p.Id);
            builder.Entity<Comment>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Comment>().Property(p => p.RecipeId).IsRequired();
            builder.Entity<Comment>().Property(p => p.UserId).IsRequired();
            builder.Entity<Comment>().Property(p => p.Value).IsRequired();

            builder.Entity<Level>().HasKey(p => p.Id);
            builder.Entity<Level>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Level>().Property(p => p.Name).IsRequired().HasMaxLength(50);

            builder.Entity<Level>().HasData
            (
                new Level() { Id = 1000, Name = "Beginner" },
                new Level() { Id = 1001, Name = "Intermediate" },
                new Level() { Id = 1002, Name = "Advanced" }
            );


            builder.Entity<Meal>().HasKey(p => p.Id);
            builder.Entity<Meal>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Meal>().Property(p => p.Name).IsRequired().HasMaxLength(50);

            builder.Entity<Meal>().HasData
            (
                new Meal() { Id = 1000, Name = "Breakfast" },
                new Meal() { Id = 1001, Name = "Lunch" },
                new Meal() { Id = 1002, Name = "Dinner" },
                new Meal() { Id = 1003, Name = "Snack" }
            );
        }


    }
}