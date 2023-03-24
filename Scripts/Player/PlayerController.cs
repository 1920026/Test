using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed;
    public LayerMask solidObjectsLayer;
    public LayerMask interactableLayer;
    public LayerMask grassLayer;
    public LayerMask portalLayer;
    public LayerMask offLayer;
    public LayerMask fallLayer;
    public LayerMask disapperLayer;

    public event Action OnEncountered;
    public event Action<string> OnBgmChanged;

    public event Action OnFalled;
    public event Action OnDisappered;

    public AudioSource audioSource;
    public AudioClip walk_grass;
    public AudioClip bumpSound;
    float second;
    public AudioClip encountSound;

    public FixedJoystick joystick;
    private Vector2 movement_Joystick;

    private bool isMoving;
    private Vector2 input;

    private Animator animator;

    [SerializeField] Camera mainCamera;

    int count;



    private void Awake()
    {
        animator = GetComponent<Animator>();
    }

    public void HandleUpdate()
    {
        if (!isMoving)
        {
            input.x = Input.GetAxisRaw("Horizontal");
            input.y = Input.GetAxisRaw("Vertical");
            Decide_movement_Joystick(joystick.Horizontal, joystick.Vertical);
            if (movement_Joystick != Vector2.zero)
            {
                input.x = movement_Joystick.x;
                input.y = movement_Joystick.y;
            }


            if (input.x != 0)
            {
                input.y = 0;
            }
            if (input != Vector2.zero)
            {
                animator.SetFloat("moveX", input.x);
                animator.SetFloat("moveY", input.y);

                var targetPos = transform.position;
                targetPos.x += input.x;
                targetPos.y += input.y;

                if (IsWalkable(targetPos))
                {
                    second = 0;
                    StartCoroutine(Move(targetPos));
                }
                else
                {
                    if (0 == second || second >= 0.5)
                    {
                        second = 0;
                        audioSource.PlayOneShot(bumpSound);
                    }
                    second += Time.deltaTime;
                }
            }
        }
        animator.SetBool("isMoving", isMoving);
    }

    IEnumerator Move(Vector3 targetPos)
    {
        isMoving = true;

        while ((targetPos - transform.position).sqrMagnitude > Mathf.Epsilon)
        {
            transform.position = Vector3.MoveTowards(transform.position, targetPos, moveSpeed * Time.deltaTime);
            yield return null;
        }
        transform.position = targetPos;

        isMoving = false;

        CheckForEncounters();
        CheckForPortals();
        CheckForOff();
        CheckForFall();
        CheckForDisapper();
    }

    bool IsWalkable(Vector3 targetPos)
    {
        if (Physics2D.OverlapCircle(targetPos, 0.1f, solidObjectsLayer | interactableLayer) != null)
        {
            return false;
        }

        return true;
    }

    void CheckForEncounters()
    {
        if (Physics2D.OverlapCircle(transform.position, 0.1f, grassLayer) != null)
        {
            audioSource.PlayOneShot(walk_grass);

            if (UnityEngine.Random.Range(1, 101) <= 10)
            {
                Debug.Log("Encounted");
                audioSource.PlayOneShot(encountSound, 0.2f);
                animator.SetBool("isMoving", false);
                OnEncountered();
                OnBgmChanged("Battle");
            }
        }
    }

    void CheckForPortals()
    {
        if (Physics2D.OverlapCircle(transform.position, 0.2f, portalLayer) != null)
        {
            Debug.Log("Changed");
            OnBgmChanged("RPG");
        }
    }
    void CheckForOff()
    {
        if (Physics2D.OverlapCircle(transform.position, 0.2f, offLayer) != null)
        {
            Debug.Log("Changed");
            OnBgmChanged("Off");
        }
    }
    void CheckForFall()
    {
        if (Physics2D.OverlapCircle(transform.position, 0.2f, fallLayer) != null)
        {
            Debug.Log("Falled");
            OnFalled();
        }
    }

    void CheckForDisapper()
    {
        if (Physics2D.OverlapCircle(transform.position, 0.2f, disapperLayer) != null)
        {
            Debug.Log("Disappered");
            OnDisappered();
            StartCoroutine(Action());

            if (count == 0)
            {
                int x = UnityEngine.Random.Range(0, 3);
                Debug.Log(x);
                if (x == 0) isMoving = true;
            }
            ++count;
        }
    }
    IEnumerator Action()
    {
        yield return new WaitForSeconds(5f);
        mainCamera.backgroundColor = new Color(0.66f, 0.06f, 0.06f, 0);
        Debug.Log("Encounted");
        audioSource.PlayOneShot(encountSound, 0.2f);
        animator.SetBool("isMoving", false);
        OnEncountered();
        OnBgmChanged("Battle");
    }

    void Decide_movement_Joystick(float x, float y)
    {
        if (Mathf.Abs(y) < Mathf.Abs(x))
        {
            if (y < x) movement_Joystick = Vector2.right;
            else movement_Joystick = Vector2.left;
        }
        else if (Mathf.Abs(x) < Mathf.Abs(y))
        {
            if (x < y) movement_Joystick = Vector2.up;
            else movement_Joystick = Vector2.down;
        }
        else
        {
            movement_Joystick.x = 0;
            movement_Joystick.y = 0;
        }
    }
}


