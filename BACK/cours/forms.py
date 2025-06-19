from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import EtudiantRegister

class UserRegistrationForm(UserCreationForm):
    class Meta:
        model=User
        fields=['username','first_name','last_name','email','password1','password2']
        widgets={
            'username': forms.TextInput(attrs={'class':'forms-input'}),
            'first_name': forms.TextInput(attrs={'class':'forms-input'}),
            'last_name': forms.TextInput(attrs={'class':'forms-input'}),
            'email': forms.EmailInput(attrs={'class':'forms-input'}),
            'password1':forms.PasswordInput(attrs={'class': 'forms-input'}),
            'password2': forms.PasswordInput(attrs={'class': 'forms-input'}),
        }

class EtudiantForm(forms.ModelForm):
    class Meta:
        model = EtudiantRegister
        fields = ['telephone']
        widgets = {
            'telephone': forms.TextInput(attrs={'class':'forms-input'})
        }
