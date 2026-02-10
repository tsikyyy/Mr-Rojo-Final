extends CharacterBody2D


const SPEED = 200.0
const JUMP_VELOCITY = -400.0


func _physics_process(delta):
	var x_direction = Input.get_axis("Gauche","Droite")
	var y_direction = Input.get_axis("Haut","Bas")
	velocity = Vector2(x_direction,y_direction)*SPEED
	shedule_animation(x_direction,y_direction)
	
	move_and_slide()

func shedule_animation(x_direction,y_direction):
	match Vector2(x_direction,y_direction):
		Vector2.ZERO:
			$Sprite2D.stop()
		Vector2.RIGHT: 
			$Sprite2D.play("AllerDroite")
			$Sprite2D.flip_h = false
		Vector2.LEFT: 
			$Sprite2D.play("AllerGauche")
			$Sprite2D.flip_h = false
		Vector2.UP: 
			$Sprite2D.play("AllerHaut")
			$Sprite2D.flip_h = false
		Vector2.DOWN: 
			$Sprite2D.play("AllerBas")
			$Sprite2D.flip_h = false
		
