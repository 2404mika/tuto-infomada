from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Admin(models.Model):
    email = models.EmailField(max_length=254, default="mikaiadavid@gmail.com", unique=True)
    password = models.CharField(max_length=100, default="1234mika2403")

    def __str__(self):
        return self.email

class EtudiantRegister(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    lastname = models.CharField(max_length=100, default="Prenom Inconnu")
    full_name = models.CharField(max_length=100, default="Nom Inconnu")
    telephone = models.CharField(max_length=10)
    def __str__(self):
        return self.full_name

class ProfRegister(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, default="Nom inconnu")
    last_name = models.CharField(max_length=100, default="Prenom Inconnu")
    telephone = models.CharField(max_length=10)
    fonction = models.CharField(max_length=100, default="Aucune fonction")
    def __str__(self):
        return self.first_name

class Domaine(models.Model):
    name = models.CharField(max_length=100)
    starting_date = models.DateTimeField(default=timezone.now)
    closing_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20,default="activé")
    image = models.ImageField(upload_to='domaines/images/', blank=True, null=True)
    def __str__(self):
        return self.name

class Parametre_formation(models.Model):
    price = models.IntegerField()
    date_from = models.DateTimeField(default=timezone.now)
    date_to = models.DateTimeField(default=timezone.now)
    duration = models.DurationField()
    def __str__(self):
        return f"Prix :{self.price} - Duree: {self.duration}"
    
class Status(models.Model):
    NOT_PUBLISHED = 0
    PUBLISHED = 1
    STATUS_CHOICES = [
        (NOT_PUBLISHED, 'Not Published'),
        (PUBLISHED, 'Published'),
    ]
    value = models.IntegerField(choices=STATUS_CHOICES, unique=True)
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name


class Formation(models.Model):
    title=models.CharField(max_length=100)
    starting_date = models.DateTimeField(default=timezone.now)
    closing_date = models.DateTimeField(default=timezone.now)
    description = models.TextField()
    parametre_formation_id = models.ForeignKey(Parametre_formation,on_delete=models.CASCADE)
    formation_domaine = models.ForeignKey(Domaine,on_delete=models.CASCADE)
    prof_id = models.ForeignKey(ProfRegister,on_delete=models.CASCADE)
    status = models.ForeignKey(Status, on_delete=models.SET_DEFAULT, default=0, related_name='formations')
    def __str__(self):
        return self.title

class Video(models.Model):
    file = models.FileField(upload_to='chapters/videos/')
    name = models.CharField(max_length=200, blank=True)
    def __str__(self):
        return self.name or self.file.name
    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.file.name
        super().save(*args, **kwargs)


class Chapter(models.Model):
    chapter_name = models.CharField(max_length=50)
    description = models.TextField()
    chapter_number = models.IntegerField()
    formation_id = models.ForeignKey(Formation, on_delete=models.CASCADE,related_name='chapters')
    videos = models.ManyToManyField(Video, related_name='chapters')
    def __str__(self):
        return self.chapter_name
    



class Formation_by_user(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    formation_id = models.ForeignKey(Formation, on_delete=models.CASCADE)
    student_name = models.CharField(max_length=100, blank=True, null=True)  # Champ optionnel
    status = models.ForeignKey(Status, on_delete=models.SET_DEFAULT, default=0, related_name='inscriptions') # Par défaut : not_confirmed

    def __str__(self):
        return f"{self.user_id.username} - {self.formation_id.title}"


class Payment(models.Model):
    formation_by_user_id = models.OneToOneField(Formation_by_user, on_delete=models.CASCADE)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    ref_transaction = models.CharField(max_length=100)
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payement_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} for {self.formation_by_user_id}"

class Discussion(models.Model):
    date_time = models.DateTimeField()
    message_text = models.TextField()
    source_id = models.ForeignKey(User,on_delete=models.CASCADE,related_name='discussion_envoyes')
    destination_id = models.ForeignKey(User,on_delete=models.CASCADE,related_name='discussion_recues')

    def __str__(self):
        return f"{self.source_id.username} -> {self.destination_id.username}"

class Role(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return self.name

class RolesUserMapping(models.Model):
    role = models.ForeignKey(Role,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"

class Token_souscription(models.Model):
    token = models.TextField()
    validation = models.ForeignKey(User,on_delete=models.CASCADE)

    def __str__(self):
        return f"Token de {self.validation.username}"

class Exam(models.Model):
    exam_name = models.CharField(max_length=50)
    exam_status = models.CharField(max_length=30)
    minimum_point = models.IntegerField()
    formation_id = models.ForeignKey(Formation,on_delete=models.CASCADE)

    def __str__(self):
        return self.exam_name

class Question(models.Model):
    question = models.TextField()
    question_type = models.TextField()
    exam_id = models.ForeignKey(Exam, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.exam_id.exam_name} : {self.question[:50]} ..."

class Exam_response_selection(models.Model):
    response = models.TextField()
    response_note = models.IntegerField()
    question_id = models.ForeignKey(Question,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.question_id.question[:30]}... : {self.response[:30]}..."

class Exam_by_user(models.Model):
    status = models.CharField(max_length=30)
    note = models.IntegerField()
    min_note = models.IntegerField()
    formation_by_user_id = models.ForeignKey(Formation_by_user,on_delete=models.CASCADE)
    exam_id = models.ForeignKey(Exam,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.formation_by_user_id.user_id.username}"

class Exam_response_by_user(models.Model):
    note = models.IntegerField()
    question_id = models.ForeignKey(Question,on_delete=models.CASCADE)
    exam_by_user = models.ForeignKey(Exam_by_user,on_delete=models.CASCADE)
    response_id = models.ForeignKey(Exam_response_selection,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.exam_by_user.formation_by_user_id.user_id.username} - {self.question_id.question} : {self.response_id}"